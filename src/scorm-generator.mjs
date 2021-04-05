import parser from 'parse5'
import fs from 'fs-extra'
import fetch from 'node-fetch'

export const generateScorm = async (course = 'intro/ta-intro', version = '1', organization = 'unfoldingWord',) => {

    const server = "https://git.door43.org"
    const org = organization
    const resource = "en_ta"
    const courseName = course.split('/').join('_')

    const path = `${server}/${org}/${resource}/raw/branch/master/${course}`

    const courseDir = `./courses/unpacked/${courseName}`

    fs.mkdir(courseDir, function(err) {

        if (err) {
        console.log(err)
        } else {
        console.log("New directory successfully created.")
        }

        fs.copy('./dist', courseDir)
            .then(async () => {
                console.log('Files copied successfully!')

                const title = await fetch(`${path}/title.md`)
                .then(response => response.text())
        
                const subTitle = await fetch(`${path}/sub-title.md`)
                .then(response => response.text())

                //Customize Course

                const indexPath = `${courseDir}/index.html`
                const manifestPath = `${courseDir}/imsmanifest.xml`

                fs.readFile(indexPath, 'utf-8', function (err, content) {

                    if (err) {
                        console.error(err);
                        return
                    }
                    const index = content.replace(/<title>(.*)<\/title>/gm, (match, p) => {
                        return `<title>${title}</title>`
                    })
                    .replace(/Course Title/gm, (match, p) => {
                        return title
                    })
                    .replace(/<p>Course subtitle<\/p>/gm, (match, p) => {
                        if(subTitle != '')
                            return `<p>${subTitle}</p>`
                        else
                            return ''
                    })
                    .replace(/markdown-src/gm, (match, p) => {
                            return `${path}/01.md`
                    })

                    fs.writeFile(indexPath, index, 'utf-8', function (err) {

                        if (err) {
                            console.error(err);
                            return
                        }
                    });
                })

                fs.readFile(manifestPath, 'utf-8', function (err, content) {

                    if (err) {
                        console.error(err);
                        return
                    }

                    const manifest = content.replace(/<title>(.*)<\/title>/gm, (match, p) => {
                        return `<title>${title}</title>`
                    })
                    .replace(/CourseIDHere/gm, (match, p) => {
                        return courseName
                    })
                    .replace(/(?<!xml.+)version="([^"]*)"/gm, (match, p) => {
                        return `version="${version}"`
                    })
                    .replace(/course-code-here/gm, (match, p) => {
                        return org
                    })
                   
                    fs.writeFile(manifestPath, manifest, 'utf-8', function (err) {

                        if (err) {
                            console.error(err);
                            return
                        }
                    });

                })
            })            
            .catch(err => console.error(err));



    })

   

}

generateScorm()