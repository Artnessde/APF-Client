<?php

/* ________________________________________________________
 *
 * Artness Javascript gzip Wrapper v2.0
 *
 * Programming: Timo Henke
 * Last Change: 2009-03-09 16:50
 * ________________________________________________________
 */

	final class APF
	{

	/* ________________________________________________________
	 *
	 * Default values
	 * ________________________________________________________
	 */

		private	$config			= 'apf.config.php',
				$JSMin			= false,
				$packids		= array(),
				$cache			= 0,
				$compression	= 0,
				$minify			= 0,
				$supportsGzip	= false,
				$cacheFile		= null,
				$cacheFileZ		= null,
				$expiresOffset	= 60,
				$encoding		= false,
				$encodings		= array(),
				$useCache		= false,
				$updateCache	= true,
				$filename		= 'apf.js',
				$headers		= array(),
				$pack			= array(),
				$Output			= '',
				$cacheFilePath	= '../_cache/apf';
	/* ________________________________________________________
	 *
	 * Arise from the sleep ...
	 * ________________________________________________________
	 */

		public function __construct( $QS )
		{
			@error_reporting(E_ERROR | E_WARNING | E_PARSE);

			if( !file_exists($this->config) || !is_readable($this->config) )
				die("/* <![CDATA[ */\n// APF Javascript - Config error\n/* ]]> */");

			require_once($this->config);

			if( file_exists($JSMin) && is_readable($JSMin) )
				$this->JSMin = $JSMin;

			list(	$this->packid,
					$this->cache,
					$this->compression,
					$this->minify
					) = explode(	'-',
									preg_replace('/[^0-9-]/si','',$QS),
									4
								);

			if( defined('PHP_OS') && (stristr(PHP_OS, 'win') || stristr(PHP_OS, 'OS/2') ) )
				$this->minify = 0;

			if( !$packs[$this->packid] )
				die("/* <![CDATA[ */\n// APF Javascript - Pack-ID error\n/* ]]> */");
			
			$this->cacheFilePath	= dirname(__FILE__).DIRECTORY_SEPARATOR.$this->cacheFilePath;
			$this->pack				= $packs[$this->packid];
			$this->compression		= (int) $this->compression > 9 ? 9 : (int) $this->compression;
			$this->cacheFile		= $this->cacheFilePath.$this->packid.'_'.md5($this->pack['name']).'.js';
			$this->cacheFileZ		= $this->cacheFilePath.$this->packid.'_'.md5($this->pack['name']).'.js.gz';
			$this->expiresOffset	= doubleval($this->cache) > 60 ? doubleval($this->cache) : 0;
			$fn						= $this->pack['filename'] != '' ? $this->pack['filename'] : $this->filename;
			$this->filename			= (strstr($_SERVER['HTTP_USER_AGENT'], 'MSIE')) ? preg_replace('/\./', '%2e', $fn, substr_count($fn, '.') - 1) : $fn;
			$this->checkGZIP();
			$this->checkCache();
			$this->createNew();
			$this->deliver();

		}

	/* ________________________________________________________
	 *
	 * Deliver the final stuff to the calling agent
	 * ________________________________________________________
	 */

		private function deliver()
		{
			if( $this->pack['namespace'] != '' )
			{
				$this->Output = str_replace('$$','@NAMESPACEDOUBLE@',$this->Output);
				$this->Output = str_replace('$',$this->pack['namespace'].'$',$this->Output);
				$this->Output = str_replace('@NAMESPACEDOUBLE@',$this->pack['namespace'].'$$',$this->Output);
			}

			if( $this->updateCache && $this->expiresOffset > 0 )
				file_put_contents($this->cacheFile,$this->Output);

			header("Content-type: text/javascript");
			header("Vary: Accept-Encoding");
			header("Expires: " . gmdate("D, d M Y H:i:s", time() + $this->expiresOffset) . " GMT");
            header('Content-Disposition: inline; filename="'.$this->filename.'";');

			$this->Output = '// <![CDATA[' . "\n" . $this->Output . '// ]]>'."\n";

			if( $this->supportsGzip && $this->compression > 0 )
			{
				$data = gzencode($this->Output, $this->compression, FORCE_GZIP);

				if( $this->updateCache && $this->expiresOffset > 0 )
					file_put_contents($this->cacheFileZ,$data);

				header("Content-Encoding: " . $this->encoding);
				header("Content-Length: ".strlen($data));
				echo $data;
				$this->addLog('NEWGZ', strlen($data));
			}
			else
			{
				header("Content-length: ".strlen($this->Output));
				echo $this->Output;
				$this->addLog('NEWPLAIN', strlen($this->Output));
			}

		}

	/* ________________________________________________________
	 *
	 * Create a new collection to be cached and delivered
	 * ________________________________________________________
	 */

		private function createNew()
		{
			if(is_array($this->pack['files']))
			{
				foreach( $this->pack['files'] as $f => $uncompressed )
				{
					if(substr($f,0,1) == '!') continue;
					if( file_exists($f) && is_readable($f) )
					{
						$ADD = "\n/* >>> " . basename($f) . " <<< */\n\n";
						if( $this->minify == '1' && $uncompressed && $this->JSMin !== false )
						{
							$S1 = trim(`{$this->JSMin} < {$f}`)."\n";
							$this->Output .= $ADD . $S1;
						}
						else
							$this->Output .= $ADD . file_get_contents($f)."\n";
					}
					else
					{
						$this->Output .= "\n/* >>> " . basename($f) . " FAILED! <<< */\n\n";
						$this->updateCache = false;
					}
				}
			}
			else
			{
				$this->updateCache = false;
			}
		}

	/* ________________________________________________________
	 *
	 * Check if we have a valid cached version of the
	 * requested pack ready to be delivered
	 * ________________________________________________________
	 */

		private function checkCache()
		{
			$CF = $this->supportsGzip ? $this->cacheFileZ : $this->cacheFile;

			if(	file_exists($CF) && (filemtime($CF) + $this->expiresOffset) > time() )
			{
				$data = file_get_contents($CF);
				if( md5($data.filemtime($CF)) == trim($_SERVER['HTTP_IF_NONE_MATCH'],'"') )
				{
					header('HTTP/1.1 304 Not Modified');
					$this->addLog('304', 0);
					exit(0);
				}

				if( $this->supportsGzip )
					header('Content-Encoding: ' . $this->encoding);

				header('ETag: "'.md5($data.filemtime($CF)).'"');
				header("Content-Length: ".strlen($data));
	            header('Content-Disposition: inline; filename="'.$this->filename.'";');
				$this->addLog('CACHE' . ($this->supportsGzip ? 'GZ' : ''), strlen($data));
				echo $data;
				exit(0);
			}
		}

	/* ________________________________________________________
	 *
	 * Check if we have a modern - gzip capable - request
	 * ________________________________________________________
	 */

		private function checkGZIP()
		{
			if( intval($this->compression) > 0 )
			{
				if (isset($_SERVER['HTTP_ACCEPT_ENCODING']))
				{
					$this->encodings = explode(',', strtolower(preg_replace("/\s+/", "", $_SERVER['HTTP_ACCEPT_ENCODING'])));
				}
				if(
					(
						in_array('gzip', (array)$this->encodings)
						|| in_array('x-gzip', (array)$this->encodings)
						|| isset($_SERVER['---------------'])
					)
					&& function_exists('ob_gzhandler')
					&& !ini_get('zlib.output_compression'))
				{
					$this->encoding = in_array('x-gzip', $this->encodings) ? "x-gzip" : "gzip";
					$this->supportsGzip = true;
				}
			}
		}
		
		private function addLog( $status, $size = 0 )
		{
		//	file_put_contents( 'delivery.log', date('Y-m-d') . "\t" . date('H:i:s') . "\t" . $this->packid . "\t" . $status . "\t" . $size . "\t" . $_SERVER['REMOTE_ADDR'] . "\t" . $_SERVER['HTTP_USER_AGENT'] . "\n", FILE_APPEND);
		}
	}

/* ________________________________________________________
 *
 * end of Artness Javascript gzip Wrapper
 * ________________________________________________________
 */

	$APF = new APF( $_SERVER['QUERY_STRING'] );
	exit(0);

?>
