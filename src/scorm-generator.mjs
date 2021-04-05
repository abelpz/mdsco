import fs from 'fs-extra'
import fetch from 'node-fetch'
import archiver from 'archiver'

export const generateScorm = async (course = 'intro/ta-intro', organization = 'unfoldingWord', lang = 'en', version = '1') => {

    const server = "https://git.door43.org"
    const org = organization
    const resource = `${lang}_ta`
    const courseName = course.split('/').join('_')

    const path = `${server}/${org}/${resource}/raw/branch/master/${course}`

     const courseDir = `./courses/unpacked/${courseName}`

    try{

        const title = await fetch(`${path}/title.md`)
        .then(response => response.text())

        const subTitle = await fetch(`${path}/sub-title.md`)
        .then(response => response.text())

        fs.mkdir(courseDir, function(err) {

            if (err) {
                console.log(err)
            } else {
                console.log(`New directory "${courseDir}" successfully created.`)
            }

            fs.copy('./dist', courseDir)
                .then(async () => {
                    console.log('Files copied successfully!')

                    //Customize Course
                
                    const coursePackDir = `./courses/packed/${courseName}`

                    fs.mkdir(coursePackDir, err => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(`New directory "${coursePackDir}" successfully created.`)
                        }
                        
                        const indexPath = `${courseDir}/index.html`

                        fs.readFile(indexPath, 'utf-8', function (err, content) {

                            if (err) {
                                console.error(err)
                                throw err
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
                                    console.error(err)
                                    throw err
                                    return
                                }
                            })
                        })

                        const manifestPath = `${courseDir}/imsmanifest.xml`

                        fs.readFile(manifestPath, 'utf-8', function (err, content) {

                            if (err) {
                                console.error(err)
                                throw err
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
                                    console.error(err)
                                    throw err
                                    return
                                }
                            })

                        })
                        
                        const mainJsPath = `${courseDir}/main.js`

                        const schemasDir = `${courseDir}/SCORM-schemas/`

                    })
                })            
                .catch(err => console.error(err))

        })

    }catch(err){

        console.error(err)    
        return

    }    

}
console.log(process.argv)

const isVersion = /(\d+\.?)+/

const args = process.argv.slice(2)

generateScorm(args[0], args[1], args[2], args[3])