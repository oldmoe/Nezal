/*
HTTP Host: static.ak.fbcdn.net
Generated: September 20th 2010 9:06:58 AM PDT
Machine: 10.138.17.185
Locale: nu_ll
Path: js/detect_broken_proxy_cache.js
*/

((location=='about:blank'&&(window.parent.eval_global||window.parent.eval))||(window.eval_global||window.eval))("if (window.CavalryLogger) { CavalryLogger.start_js([\"js\\\/detect_broken_proxy_cache.js\"]); }\n\nfunction detect_broken_proxy_cache(d,a){var b=getCookie(a);if((b!=d)&&(b!=null)&&(d!='0')){var c={c:'si_detect_broken_proxy_cache',m:a+' '+d+' '+b};var e=new URI('\/common\/scribe_endpoint.php').getQualifiedURI().toString();new AsyncSignal(e,c).send();}}\n\nif (window.Bootloader) { Bootloader.done([\"js\\\/detect_broken_proxy_cache.js\"]); }")