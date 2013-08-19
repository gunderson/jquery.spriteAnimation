# jquery.spriteAnimation

[![Build Status](https://travis-ci.org/gunderson/jquery.spriteAnimation.png?branch=master)](https://travis-ci.org/gunderson/jquery.spriteAnimation)

Appends a new div element to object and animates through a sequence of frames in a single image.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/gunderson/jquery.spriteAnimation/master/dist/jquery.spriteAnimation.min.js
[max]: https://raw.github.com/gunderson/jquery.spriteAnimation/master/dist/jquery.spriteAnimation.js

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
    length: 11
  })
</script>
```

## Documentation

### Commands

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

### Parametric commands

Commands that require parameters should be set as properties on objects. Commands can be issued in the same object as option updates.

#### gotoFrame

    $(".testButton").spriteAnimation({gotoFrame:0});

Sets the current frame of the animation to the integer value

Special parameter `'end'` goes to the last frame of the animation. Useful for reversing.

#### gotoFrameRatio

    $(".testButton").spriteAnimation({gotoFrameRatio:0});

Takes floats 0-1. Sets the current frame of the animation to the frame at the ratio of the total animation. Useful for tweening.


### Options

#### src

Image source url. If not provided, the script tries to use the element's `background-image` or the `<img src>`.

    { src: "filmstrip.png" }

#### firstFramePosition

Position of the first frame in sequence. (allows you to put multiple sequences in one image)

    // Object with x and y parameters. 
    { firstFramePosition: {x:0, y:0} }

#### orientation

Direction to look for subsequent frames.

    // String, either 'x' or 'y'. 
    { orientation: "x" }

#### frameWidth

Width of the frame in px. Defaults to the css width of the element.

    // Number 
    { frameWidth: 25 }

#### frameHeight

Height of the frame in px. Defaults to the css width of the element.

    // Number 
    { frameHeight: 25 }

#### frameSpacing

Spacing between frames in px

    // Number 
    { frameSpacing: 0 }

#### frameRate

Frames per second

    // Number 
    { frameRate: 60 }

#### length (required)

Number of frames in the sequence.

    // Number 
    { length: 25 }

#### loop

Loop on complete.

    // Boolean 
    { loop: false }

#### onComplete

Callback on complete.

    // Function 
    { onComplete: null }

#### command

Adds a command to execute after the settings have been set
    
    // Takes any String command from the Commands section
    { command: null }

### Sequences

Sequences can be added via the `addSequence` or `addSequences` options. If no sequences are explicitly defined, a default sequence labeled `'a'` is created transparently using the main `options` object.

Sequence objects can contain the following parameters, but default to the same values as above if they are omitted:

    { addSequences: {
        'myLabel':{
            duration:25,
            loop:false,
            firstFramePosition: {x:0, y:0},
            reverse: false,
            onComplete: null
        }
    }

or

    { addSequence: {
        label: 'myLabel',
        duration:25,
        loop:false,
        firstFramePosition: {x:0, y:0},
        reverse: false,
        onComplete: null
    }

Note the inclusion of a `label` in an object passed to `addSequence` is required, while the object key is used as the label in `addSequences`

#### setSequence

Used to change the sequence

    //String
    { setSequence: 'myLabel' }

#### gotoAndPlay

Shortcut method that sets a new sequence and immediately starts playing it.

    { gotoAndPlay: 'myLabel' }

Is the same as

    { setSequence: 'myLabel',
        command: 'play'
    }


Events
-----

#### spriteAnimation:complete

jquery.spriteAnimation fires `spriteAnimation:complete` events on the hosting jquery object whenever any sequence completes. It also fires a `spriteAnimation:complete:[sequence label]` event when labeled sequences complete.


