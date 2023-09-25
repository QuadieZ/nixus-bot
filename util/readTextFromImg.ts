import { PSM, createWorker } from "tesseract.js";

export async function readTextFromImg(img: string) {
    const worker = await createWorker({
        logger: m => console.log(m)
    });
    await worker.loadLanguage('eng+tha')
    await worker.initialize('eng+tha')
    await worker.setParameters({
        tessedit_pageseg_mode: PSM.AUTO_OSD
    })
    const { data: { text } } = await worker.recognize(img);
    await worker.terminate();

    return text
}