/*
transitions.js

Based on Easing Equations v2.0
(c) 2003 Robert Penner, all rights reserved.
This work is subject to the terms in http://www.robertpenner.com/easing_terms_of_use.html

Adapted for Scriptaculous by Ken Snyder (kendsnyder ~at~ gmail ~dot~ com) June 2006
*/

/*
Overshooting Transitions
*/
// Elastic (adapted from "EaseOutElastic")
Effect.Transitions.Elastic = function(pos) {
return -1*Math.pow(4,-8*pos) * Math.sin((pos*6-1)*(2*Math.PI)/2) + 1;
};
// SwingFromTo (adapted from "BackEaseInOut")
Effect.Transitions.SwingFromTo = function(pos) {
var s = 1.70158;
if ((pos/=0.5) < 1) return 0.5*(pos*pos*(((s*=(1.525))+1)*pos - s));
return 0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos + s) + 2);
};
// SwingFrom (adapted from "BackEaseIn")
Effect.Transitions.SwingFrom = function(pos) {
var s = 1.70158;
return pos*pos*((s+1)*pos - s);
};
// SwingTo (adapted from "BackEaseOut")
Effect.Transitions.SwingTo = function(pos) {
var s = 1.70158;
return (pos-=1)*pos*((s+1)*pos + s) + 1;
};

/*
Bouncing Transitions
*/
// Bounce (adapted from "EaseOutBounce")
Effect.Transitions.Bounce = function(pos) {
if (pos < (1/2.75)) {
return (7.5625*pos*pos);
} else if (pos < (2/2.75)) {
return (7.5625*(pos-=(1.5/2.75))*pos + .75);
} else if (pos < (2.5/2.75)) {
return (7.5625*(pos-=(2.25/2.75))*pos + .9375);
} else {
return (7.5625*(pos-=(2.625/2.75))*pos + .984375);
}
};
// BouncePast (new creation based on "EaseOutBounce")
Effect.Transitions.BouncePast = function(pos) {
if (pos < (1/2.75)) {
return (7.5625*pos*pos);
} else if (pos < (2/2.75)) {
return 2 - (7.5625*(pos-=(1.5/2.75))*pos + .75);
} else if (pos < (2.5/2.75)) {
return 2 - (7.5625*(pos-=(2.25/2.75))*pos + .9375);
} else {
return 2 - (7.5625*(pos-=(2.625/2.75))*pos + .984375);
}
};

/*
Gradual Transitions
*/
// EaseFromTo (adapted from "Quart.EaseInOut")
Effect.Transitions.EaseFromTo = function(pos) {
if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,4);
return -0.5 * ((pos-=2)*Math.pow(pos,3) - 2);
};
// EaseFrom (adapted from "Quart.EaseIn")
Effect.Transitions.EaseFrom = function(pos) {
return Math.pow(pos,4);
};
// EaseTo (adapted from "Quart.EaseOut")
Effect.Transitions.EaseTo = function(pos) {
return Math.pow(pos,0.25);
};