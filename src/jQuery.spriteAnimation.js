/*
 * jQuery.spriteAnimation
 * https://github.com/patrickgunderson/jQuery.spriteAnimation
 *
 * Copyright (c) 2013 Patrick Gunderson
 * Licensed under the MIT license.
 */

 (function($) {
    $.spriteAnimation = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        base.currentFrame = 0;
        base.running = false;
        base.timeout = null;
        
        // Add a reverse reference to the DOM object
        base.$el.data("spriteAnimation", base);
        
        base.init = function(){
            base.el = el;
            base.options = $.extend({},$.spriteAnimation.options, options);
            base.$el = $(this.el);
            base.generate();
            base.setFrameRate(base.options.frameRate);
        };

        base.generate = function(){
            base.$anim = $("<div/>").addClass('spriteAnimation');
            base.$anim.css({
              backgroundImage: 'url(' + base.options.src + ')',
              backgroundPosition: base.options.firstFramePosition.x + "px " + base.options.firstFramePosition.y + "px",
              width: (base.options.frameWidth) + "px",
              height: (base.options.frameHeight) + "px",
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
            base.options.reverse = false;
            base.delayNextFrame();
            return base;
        };

        base.rewind = function(){
            base.running = true;
            base.options.reverse = true;
            base.delayPrevFrame();
            return base;
        };

        base.stop = function(){
            if (base.timeout) clearTimeout(base.timeout);
            base.running = false;
            return base;
        };

        base.reset = function(){
            base.stop();
            base.currentFrame = 0;
            base.gotoFrame(0);
            return base;
        };

        base.gotoFrame = function(frameNumber){
            var newX = -base.options.firstFramePosition.x;
            if (base.options.orientation === "x" ) {
                newX = (-frameNumber * (base.options.frameWidth + base.options.frameSpacing)) - base.options.firstFramePosition.x;
            }
            var newY = -base.options.firstFramePosition.y;
            if (base.options.orientation === "y" ) {
                newY = (-frameNumber * (base.options.frameWidth + base.options.frameSpacing)) - base.options.firstFramePosition.y;
            }

            base.$anim.css({
                backgroundPosition: newX + "px " + newY + "px"
            });
            if (base.options.reverse){
                base.delayPrevFrame();
            } else {
                base.delayNextFrame();
            }
            return base;
        };

        base.nextFrame = function(){
            if (++base.currentFrame < base.options.numFrames){
                return base.gotoFrame(base.currentFrame);
            } else {
                if (base.options.loop){
                    base.currentFrame = 0;
                    base.$el.trigger('loop');
                    return gotoFrame(base.currentFrame);
                } else {
                    return base.stop();
                }
            }
        };

        base.prevFrame = function(){
            if (--base.currentFrame >= 0){
                return base.gotoFrame(base.currentFrame);
            } else {
                if (base.options.loop){
                    base.currentFrame = base.options.numFrames;
                    base.$el.trigger('loop');
                    return base.gotoFrame(base.currentFrame);
                } else {
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

        base.complete = function(){
            if (typeof(base.options.onComplete) === "function"){
                base.options.onComplete();
            }
            base.$el.trigger('complete');
        };

        // Run initializer
        base.init();
        return base;
    };

    $.spriteAnimation.options =  {
        src: "",
        firstFramePosition: {x:0, y:0},
        orientation: "x",
        frameWidth: 25,
        frameHeight: 25,
        frameSpacing: 0,
        frameRate: 25, // fps,
        numFrames: 10,
        loop: false,
        reverse: false,
        onComplete: null
    };

    // Collection method.
    $.fn.spriteAnimation = function(settings) {
        return this.each(function() {
            var options, carousel;
            if(!(anim = this.spriteAnimation)) {
                if (!settings.src) {
                    if (!(settings.src = this.css('backgroundImage')) ||
                        !(settings.src = this.attr('src'))) {
                        var error = (console) ? console.error("SpriteAnimation requires image src.") : false;
                        return this;
                    }
                }

                options = $.extend({}, $.spriteAnimation.options, settings);
                this.spriteAnimation = anim = new $.spriteAnimation(this, options);
                var message = (console) ? console.log("new SpriteAnimation, " + settings.src): true;
            }
            if(settings && typeof settings === "object") {
                $.extend(anim.options, settings);
                if (settings.frameRate){
                    anim.setFrameRate(settings.frameRate);
                }
                if (settings.firstFramePosition){
                    anim.gotoFrame(0);
                }
                if (settings.frame) {
                    anim.gotoFrame(settings.frame);
                }
            } else if(settings && typeof settings === "string") {
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