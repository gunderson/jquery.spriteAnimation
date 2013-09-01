package pg {
	
	import flash.display.IBitmapDrawable;
	import com.adobe.images.PNGEncoder;
	import flash.display.Stage;
	import flash.events.Event;
	import flash.display.BitmapData;
	import flash.utils.ByteArray;
	import flash.filesystem.File;
	import flash.filesystem.FileStream;
	import flash.filesystem.FileMode;
	import flash.geom.Rectangle;
	import flash.geom.Point;
	import flash.geom.Matrix;
    import flash.utils.getTimer;
    import flash.events.EventDispatcher;
	
	public class FrameExporter extends EventDispatcher {
		private var stage:Stage;
		private var displayObject:IBitmapDrawable;
		private var fileFolder:File;
		private var fileName:String;
		private var frameIndex:Number = 0;
		private var frameCaches:Vector.<Vector.<BitmapData>>;
		public var layout:String = 'vert';
		public var output:String = 'spritesheet';
		public var startTime:Number = 0;
		private var _sizes:Array = [1];
		
		public static var HORIZONTAL:String = 'horiz';
		public static var VERTICAL:String = 'vert';
		public static var SPRITESHEET:String = 'spritesheet';
		public static var FRAMES:String = 'frames';

		
		public function FrameExporter(stage:Stage, fileName:String = "frameExport", displayObject:IBitmapDrawable = null) {
			this.displayObject = (displayObject !== null) ? displayObject : stage;
			this.fileName = fileName;
			this.stage = stage;
			sizes = [1];
		}
		
		
		public function set sizes(input:Array):void{
			_sizes = input;
			frameCaches = new Vector.<Vector.<BitmapData>>();
			for (var i:int = 0; i < input.length; i++){
				frameCaches.push(new Vector.<BitmapData>());
			}
			trace('frameCaches.length', frameCaches.length);
		}
		
		public function get sizes():Array{
			return _sizes;
		}
		
		public function start():void{
			this.frameIndex = 0;
			this.stage.addEventListener(Event.ENTER_FRAME, onEnterFrame);
			this.onEnterFrame();
		}
		
		public function stop(flush:Boolean = true):void{
			this.stage.removeEventListener(Event.ENTER_FRAME, onEnterFrame);
			if (flush){
				this.flush();
			}
		}
		
		public function flush():void{
			fileFolder = new File();
			fileFolder.addEventListener(Event.SELECT, onFolderSelected);
			fileFolder.browseForDirectory("Choose a directory");
		}

		private function onFolderSelected(e:Event):void{
			fileFolder = e.target as File;
			if (output === FrameExporter.SPRITESHEET){
				exportSpritesheet(frameCaches, layout);
			} else if (output === FrameExporter.FRAMES){
				exportFrames(frameCaches);
			}
		}
		
		private function onEnterFrame(e:Event = null):void{
			this.frameIndex++;
			for (var i:int = 0; i < this.sizes.length; i++){
				frameCaches[i].push(captureFrame(_sizes[i]));
			}
		}
		
		private function captureFrame(scale:Number):BitmapData{
			var bmd:BitmapData = new BitmapData(this.stage.stageWidth * scale, this.stage.stageHeight * scale, true, 0);
			var matrix:Matrix = new Matrix();
			matrix.scale(scale,scale);
			bmd.draw(this.displayObject, matrix);
			return bmd;
		}

		private function exportFrames(frameCaches:Vector.<Vector.<BitmapData>>):void{
			startTime = getTimer();
			var byteArray:ByteArray;
			var file:File;
			var stream:FileStream;
			var totalSize:int = 0;
			var scaleText:String = '';
			var frameCache;
			var i,len;
			
			for (var fc = 0, fclen=frameCaches.length; fc < fclen; fc++){
				startTime = getTimer();
				frameCache = frameCaches[fc];
				scaleText = frameCache[0].width;
				for (i=0, len=frameCache.length; i < len; i++){
					byteArray = PNGEncoder.encode(frameCache[i]);
					file = fileFolder.resolvePath("exports/"+ scaleText + "/" + this.fileName + "_"  + matchLength(i,frameCache.length) + ".png");
					stream = new FileStream();
					stream.open(file, FileMode.WRITE);
					stream.writeBytes(byteArray);
					stream.close();
					totalSize += file.size;
					trace(' -> Exporting Frame ' + i + ' of ' + frameCache.length + ' @' + scaleText + " " + (file.size / 1024) + 'kb');   
				}
				trace(
					"Export Complete \n",
					"  - " + i + " frames\n",
					"  - " + _sizes[fc] + "x\n",
					"  - " + frameCache[0].width + "x"+ frameCache[0].height +" \n",
					"  - total size " + (totalSize / 1024) + "kb\n",
					"  - in " + ((getTimer() - startTime)/1000) + " seconds"
				);
			}
			
			this.dispatchEvent(new Event(Event.COMPLETE));
		}

		private function exportSpritesheet(frameCaches:Vector.<Vector.<BitmapData>>, layout:String = 'horiz'):void{
			startTime = getTimer();
			var frameWidth:Number;
			var frameHeight:Number;
			var dx:Number;
			var dy:Number;
			var scaleText:String = '';
			var frameCache;
			var bmd:BitmapData;
			var	sourceRect:Rectangle;
			var destPoint:Point;
			var byteArray:ByteArray;
			var file:File;
			var stream:FileStream;
			var i,len;
			
			for (var fc = 0, lenfc=frameCaches.length; fc < lenfc; fc++){
				startTime = getTimer();
				frameCache = frameCaches[fc];
				scaleText = frameCache[0].width;
				
				frameWidth = frameCache[0].width;
				frameHeight = frameCache[0].height;
			
				dx = (layout == FrameExporter.HORIZONTAL) ? frameWidth : 0;
				dy = (layout == FrameExporter.HORIZONTAL) ? 0 : frameHeight;
			
				bmd = new BitmapData(frameWidth + (dx * (frameCache.length - 1)), frameHeight  + (dy * (frameCache.length - 1)), true, 0);
				sourceRect = new Rectangle(0,0,frameWidth, frameHeight);
				
				destPoint = new Point();
				
				for (i=0, len=frameCache.length; i < len; i++){
					destPoint.x = dx * i;
					destPoint.y = dy * i;
					bmd.copyPixels(frameCache[i], sourceRect, destPoint);
				}
				byteArray = PNGEncoder.encode(bmd);
				file = fileFolder.resolvePath("exports/" + this.fileName + "_spritesheet_" + scaleText + "_" + frameCache.length + "f_" + layout + ".png");
				stream = new FileStream();
				stream.open(file, FileMode.WRITE);
				stream.writeBytes(byteArray);
				stream.close();
				trace(
					"Export "+ scaleText +" Complete \n",
					"  - " + i + " frames\n",
					"  - " + _sizes[fc] + "x\n",
					"  - " + frameCache[0].width + "x"+ frameCache[0].height +" \n",
					"  - " + (file.size / 1024) + 'kb\n',
					"  - in " + ((getTimer() - startTime)/1000) + " seconds"
				);
			}
			this.dispatchEvent(new Event(Event.COMPLETE));
		}
		
		private function matchLength(n0:Number, n1:Number):String{
			if (n0 < n1){
				return addLeadingZeros(n0, n1.toString().length);
			} else {
				return addLeadingZeros(n1, n0.toString().length);
			}
		}
		
		private function addLeadingZeros(num:Number, len:Number):String{
			var s:String = num.toString();
			while(s.length < len){
				s = "0" + s;
			}
			return s;
		}

	}
	
}
