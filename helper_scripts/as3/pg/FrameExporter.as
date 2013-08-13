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
    import flash.utils.getTimer;
	
	public class FrameExporter {
		private var stage:Stage;
		private var displayObject:IBitmapDrawable;
		private var fileFolder:File;
		private var fileName:String;
		private var frameIndex:Number = 0;
		private var frameCache:Vector.<BitmapData>;
		public var layout:String = 'vert';
		public var output:String = 'spritesheet';
		public var startTime:Number = 0;
		
		public static var HORIZONTAL:String = 'horiz';
		public static var VERTICAL:String = 'vert';
		public static var SPRITESHEET:String = 'spritesheet';
		public static var FRAMES:String = 'frames';
		
		public function FrameExporter(stage:Stage, fileName:String = "frameExport", displayObject:IBitmapDrawable = null) {
			this.displayObject = (displayObject !== null) ? displayObject : stage;
			this.fileName = fileName;
			this.stage = stage;
			frameCache = new Vector.<BitmapData>();
		}
		
		public function start():void{
			this.frameIndex = 0;
			this.stage.addEventListener(Event.ENTER_FRAME, onEnterFrame);
			this.onEnterFrame();
		}
		
		public function stop(flush:Boolean = true):void{
			this.stage.removeEventListener(Event.ENTER_FRAME, onEnterFrame);
			if (flush){
				fileFolder = new File();
				fileFolder.addEventListener(Event.SELECT, onFolderSelected);
				fileFolder.browseForDirectory("Choose a directory");
			}
		}

		private function onFolderSelected(e:Event):void{
			fileFolder = e.target as File;
			if (output === FrameExporter.SPRITESHEET){
				exportSpritesheet(frameCache, layout);
			} else if (output === FrameExporter.FRAMES){
				exportFrames(frameCache);
			}
		}
		
		private function onEnterFrame(e:Event = null):void{
			this.frameIndex++;
			var bmd:BitmapData = new BitmapData(this.stage.stageWidth, this.stage.stageHeight, true, 0);
			bmd.draw(this.displayObject);
			frameCache.push(bmd);
		}

		private function exportFrames(frameCache:Vector.<BitmapData>):void{
			startTime = getTimer();
			var byteArray:ByteArray;
			var file:File;
			var stream:FileStream;
			var totalSize = 0;
			
			for (var i=0, len=frameCache.length; i < len; i++){
				byteArray = PNGEncoder.encode(frameCache[i]);
				file = fileFolder.resolvePath("exports/" + this.fileName + "." + matchLength(i,frameCache.length) + ".png");
				stream = new FileStream();
				stream.open(file, FileMode.WRITE);
				stream.writeBytes(byteArray);
				stream.close();
				totalSize += file.size;
				trace(' -> Exporting Frame ' + i + ' - ' + (file.size / 1024) + 'kb');   
			}
			trace(
				"Export Complete \n",
				"  - " + i + " frames\n",
				"  - total size " + (totalSize / 1024) + "kb\n",
				"  - in " + ((getTimer() - startTime)/1000) + " seconds"
			);
		}

		private function exportSpritesheet(frameCache:Vector.<BitmapData>, layout:String = 'vert'):void{
			startTime = getTimer();
			var frameWidth:Number = frameCache[0].width;
			var frameHeight:Number = frameCache[0].width;
			
			var dx:Number = (layout == FrameExporter.HORIZONTAL) ? frameWidth : 0;
			var dy:Number = (layout == FrameExporter.HORIZONTAL) ? 0 : frameHeight;
			
			var bmd:BitmapData = new BitmapData(frameWidth + (dx * (frameCache.length - 1)), frameHeight  + (dy * (frameCache.length - 1)), true, 0);
			var	sourceRect:Rectangle = new Rectangle(0,0,frameWidth, frameHeight);
			
			var destPoint:Point = new Point();
			
			for (var i=0, len=frameCache.length; i < len; i++){
				destPoint.x = dx * i;
				destPoint.y = dy * i;
				bmd.copyPixels(frameCache[i], sourceRect, destPoint);
			}
			var byteArray:ByteArray = PNGEncoder.encode(bmd);
			var file:File = fileFolder.resolvePath("exports/" + this.fileName + "_spritesheet_x" + frameCache.length + "_" + layout + ".png");
			var stream:FileStream = new FileStream();
			stream.open(file, FileMode.WRITE);
			stream.writeBytes(byteArray);
			stream.close();
			trace(
				"Export Complete \n",
				"  - " + i + " frames\n",
				"  - " + (file.size / 1024) + 'kb\n',
				"  - in " + ((getTimer() - startTime)/1000) + " seconds"
			);
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
