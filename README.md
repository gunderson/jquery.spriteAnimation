# jQuery.SpriteAnimation

Appends a new div element to object and animates through a sequence of frames in a single image.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/patrickgunderson/jquery.spriteAnimation/master/dist/jquery.spriteAnimation.min.js
[max]: https://raw.github.com/patrickgunderson/jquery.spriteAnimation/master/dist/jquery.spriteAnimation.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/jquery.spriteAnimation.min.js"></script>
<script>
$(".testButton").spriteAnimation({
    src: "filmstrip.png",
    frameWidth: 24,
    frameHeight: 24,
    frameSpacing: 1,
    frameRate: 60,
    numFrames: 11
  })
</script>
```

## Documentation

### Methods

#### play

    $(".testButton").spriteAnimation('play');

Plays the animation sequence forward.

#### rewind

    $(".testButton").spriteAnimation('rewind');

Plays the animation sequence backward.

#### stop

    $(".testButton").spriteAnimation('stop');

Stops the animation sequence  where it is.

#### reset

    $(".testButton").spriteAnimation('reset');

Stops the animation sequence and frame to 0.

### Options

#### src - Required

Image source url.

    { src: "filmstrip.png" }


#### firstFramePosition

Position of the first frame in sequence. (allows you to put multiple sequences in one image)

    // Object with x and y parameters. 
    { firstFramePosition: {x:0, y:0} }

#### orientation

Position of the first frame in sequence. (allows you to put multiple sequences in one image)

    // String, either 'x' or 'y'. 
    { orientation: "x" }

#### frameWidth

Width of the frame in px

    // Number 
    { frameWidth: 25 }

#### frameHeight

Height of the frame in px

    // Number 
    { frameHeight: 25 }

#### frameSpacing

Spacing between frames in px

    // Number 
    { frameSpacing: 0 }

#### frameRate

Frames per second

    // Number 
    { frameRate: 25 }

#### numFrames

Number of frames in the sequence.

    // Number 
    { numFrames: 10 }

#### loop

Loop on complete.

    // Boolean 
    { loop: false }

#### onComplete

Callback on complete.

    // Function 
    { onComplete: null }