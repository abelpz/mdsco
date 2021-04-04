import Reveal from 'reveal.js'
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/black.css'
import './scorm_api_wrapper.js'

let deck = new Reveal({
    plugins: [ Markdown ]
 })
 deck.initialize();

 Reveal.addEventListener( 'slidechanged', function( event ) {
    // event.previousSlide, event.currentSlide, event.indexh, event.indexv

    pipwerks.SCORM.set("cmi.core.lesson_location", event.currentSlide);
    pipwerks.SCORM.save();

    if(event.currentSlide === Reveal.getTotalSlides()){
        pipwerks.SCORM.set("cmi.core.lesson_status", "completed");
        pipwerks.SCORM.quit();
    }

} );