/*! jquery.spriteAnimation - v0.2.1 - 2013-08-19
* https://github.com/gunderson/jquery.spriteAnimation
* Copyright (c) 2013 Patrick Gunderson; Licensed MIT */
(function($) {
    $.spriteAnimation = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        base.currentFrameIndex = 0;
        base.running = false;
        base.timeout = null;

        // Add a reverse reference to the DOM object
        base.$el.data("spriteAnimation", base);

        base.init = function(){
            base.el = el;
            base.options = $.extend({},$.spriteAnimation.options, options);
            base.$el = $(this.el);
            base.setFrameRate(base.options.frameRate);
        };

        base.generate = function(){
            base.$anim = $("<div/>").addClass('spriteAnimation');
            base.$anim.css({
              backgroundImage: 'url(' + base.options.src + ')',
              backgroundPosition: base.options.currentSequence.firstFramePosition.x + "px " + base.options.currentSequence.firstFramePosition.y + "px",
              width: base.options.frameWidth,
              height: base.options.frameHeight,
              overflow: "hidden"
          });
            base.$el.append(base.$anim);
        };

        base.setFrameRate = function(frameRate){
            base.frameRate = frameRate;
            base.frameDelay = 1000 / frameRate;
            return base;
        };

        base.play = function(){
            base.running = true;
            base.options.currentSequence.reverse = false;
            base.delayNextFrame();
            return base;
        };

        base.rewind = function(){
            base.running = true;
            base.options.currentSequence.reverse = true;
            base.delayPrevFrame();
            return base;
        };

        base.stop = function(){
            if (base.timeout) {clearTimeout(base.timeout);}
            base.running = false;
            return base;
        };

        base.reset = function(){
            base.stop();
            base.currentFrameIndex = 0;
            base.gotoFrame(0);
            return base;
        };

        base.gotoFrame = function(frameNumber){

            var newX = -base.options.currentSequence.firstFramePosition.x;
            if (base.options.orientation === "x" ) {
                newX = (-frameNumber * (base.options.frameWidth + base.options.frameSpacing)) - base.options.currentSequence.firstFramePosition.x;
            }
            var newY = -base.options.currentSequence.firstFramePosition.y;
            if (base.options.orientation === "y" ) {
                newY = (-frameNumber * (base.options.frameHeight + base.options.frameSpacing)) - base.options.currentSequence.firstFramePosition.y;
            }

            base.$anim.css({
                backgroundPosition: newX + "px " + newY + "px"
            });
            if (base.options.currentSequence.reverse){
                base.delayPrevFrame();
            } else {
                base.delayNextFrame();
            }
            return base;
        };

        base.nextFrame = function(){
            if (++base.currentFrameIndex < base.options.currentSequence.length){
                return base.gotoFrame(base.currentFrameIndex);
            } else {
                if (base.options.currentSequence.loop){
                    base.currentFrameIndex = 0;
                    base.$el.trigger('spriteAnimation:loop');
                    base.$el.trigger('spriteAnimation:loop-to-start');
                    return base.gotoFrame(base.currentFrameIndex);
                } else {
                    base.complete();
                    return base.stop();
                }
            }
        };

        base.prevFrame = function(){
            if (--base.currentFrameIndex >= 0){
                return base.gotoFrame(base.currentFrameIndex);
            } else {
                if (base.options.currentSequence.loop){
                    base.currentFrameIndex = base.options.currentSequence.length;
                    base.$el.trigger('spriteAnimation:loop');
                    base.$el.trigger('spriteAnimation:loop-to-end');
                    return base.gotoFrame(base.currentFrameIndex);
                } else {
                    base.complete();
                    return base.stop();
                }
            }
        };

        base.delayNextFrame = function(){
            if (base.running){
                base.timeout = setTimeout(function() {
                    base.nextFrame();
                }, base.frameDelay);
            }
        };


        base.delayPrevFrame = function(){
            if (base.running){
                base.timeout = setTimeout(function() {
                    base.prevFrame();
                }, base.frameDelay);
            }
        };

        base.addSequence = function(sequenceObject){
            base.options.sequences[sequenceObject.label] = $.extend({}, base.options.defaultSequence, sequenceObject);
        };

        base.complete = function(){
            if (typeof(base.options.currentSequence.onComplete) === "function"){
                base.options.currentSequence.onComplete();
            }
            base.$el.trigger('spriteAnimation:complete');
            base.$el.trigger('spriteAnimation:complete:' + base.options.currentSequence.label);
        };

        // Run initializer
        base.init();
        return base;
    };

    $.spriteAnimation.options =  {
        src: "",
        sequences: {},
        defaultSequence: {
            label: "a",
            length:25, // in frames
            loop:false,
            firstFramePosition: {x:0, y:0},
            reverse: false,
            onComplete: null
        },
        orientation: "x",
        frameWidth: 25,
        frameHeight: 25,
        frameSpacing: 0,
        frameRate: 60, // fps,
        gotoAndPlay: "a"
    };

    // Collection method.
    $.fn.spriteAnimation = function(settings) {
        return this.each(function() {
            var $this = $(this);
            var options, 
                anim;
                settings = settings || {};
            if(!(anim = this.spriteAnimation)) {
                //grab the sprite image from css if it isn't defined
                if (!settings.src) {
                    if (!(settings.src = $this.css('backgroundImage')) &&
                        !(settings.src = $this.attr('src'))) {
                        var error = (console) ? console.error("SpriteAnimation requires image src.") : false;
                        return this;
                    } else {
                        $this.css('backgroundImage', 'none');
                        $this.attr('src', "");
                    }
                    if (settings.src.substr(0,4) === "url("){
                        settings.src = settings.src.replace('url(','').replace(')','');
                    }
                }

                if (!settings.frameWidth){
                    settings.frameWidth = $this.width();
                }

                if (!settings.frameHeight){
                    settings.frameHeight = $this.height();
                }

                this.spriteAnimation = anim = new $.spriteAnimation(this, options);
                if (!settings.addSequences && !settings.addSequence){
                    // allow a single sequence to be set simply by directly adding options.
                    options = $.extend({}, $.spriteAnimation.options);
                    settings.label = settings.label || "a"; // "a" is the default sequence names
                    settings.addSequence = $.extend({}, settings, {addSequence:null});
                    settings.setSequence = settings.label;
                } else {
                    options = $.extend({}, $.spriteAnimation.options, settings);
                }
            }
            if(settings && typeof settings === "object") {
                $.extend(anim.options, settings);
                if (settings.addSequences){
                    $.each(settings.addSequences, function(i, obj){
                        this.label = i;
                        anim.addSequence(this);
                    });
                }
                if (settings.addSequence){
                    if (!settings.addSequence.label){
                        settings.label = 'a' + anim.sequences.length;
                    }
                    anim.addSequence(settings.addSequence);
                }
                if (settings.gotoAndPlay){
                    settings.setSequence = settings.gotoAndPlay;
                    settings.command = 'play';
                }
                if (settings.setSequence){
                    anim.options.currentSequence = anim.options.sequences[settings.setSequence];
                    settings.gotoFrame = settings.gotoFrame || 0;
                }

                if (!anim.$anim){
                    anim.generate();
                }
                if (settings.frameRate){
                    anim.setFrameRate(settings.frameRate);
                }
                if (settings.gotoFrame >= 0 || settings.gotoFrame) {
                    if (settings.gotoFrame === 'end'){
                        settings.gotoFrame = anim.options.currentSequence.length - 1;
                    }
                    anim.stop();
                    anim.currentFrameIndex = settings.gotoFrame;
                    anim.gotoFrame(settings.gotoFrame);
                }
                if (settings.gotoFrameRatio >= 0) {
                    settings.gotoFrameRatio = Math.max(Math.min(settings.gotoFrameRatio, 1), 0);
                    anim.currentFrameIndex = (settings.gotoFrameRatio * anim.options.currentSequence.length) >> 0;
                    anim.gotoFrame(anim.currentFrameIndex);
                }
                if (settings.command){
                    settings = settings.command;
                }
            }
            if(settings && typeof settings === "string") {
                if (!anim.$anim){
                    anim.generate();
                }

                if(settings === "play") {
                    anim.play();
                }
                if(settings === "rewind") {
                    anim.rewind();
                }
                if(settings === "stop") {
                    anim.stop();
                }
                if(settings === "reset") {
                    anim.reset();
                }
            } else if(settings && !isNaN( parseInt(settings, 10) )){
                anim.gotoFrame(settings);
            } else if (!settings){
                anim.reset();
            }

            return this;
        });
    };
})(jQuery);
