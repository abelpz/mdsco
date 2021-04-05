import Reveal from 'reveal.js'
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/custom.css'
import { initCourse, setComplete } from './scormFunctions'

window.onload =  () => initCourse()

let deck = new Reveal({
    plugins: [ Markdown ]
})
deck.initialize()


Reveal.addEventListener( 'slidechanged', function( event ) {
    // event.previousSlide, event.currentSlide, event.indexh, event.indexv
    console.log(`slide changed you are viewing slide no. ${event.currentSlide} of ${Reveal.getTotalSlides()}`)
    scorm.set("cmi.core.lesson_location", event.currentSlide)
    scorm.save()

    if(event.currentSlide === Reveal.getTotalSlides()){
        setComplete()
    }

} );