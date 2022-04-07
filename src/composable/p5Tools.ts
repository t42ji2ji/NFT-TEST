import { onMounted, ref, watch } from 'vue';
import P5 from 'p5';


export const wrapMode = ref(false);
export const inputText = ref('')
export const textAlign = ref(0)
export const bgColor = ref('#262831')
export const textColor = ref('#FFFFFF')
export const canvasRef = ref<HTMLElement>()
export const fileImage = ref()
export const googleImageJson = ref()
export const address = ref('')
export const imgUrl = ref('')
export const showImgLoading = ref(false)

let p5 = ref();
let json;

function hexToRGB(hex: string, alpha: number = 1) {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
  } else {
    return "rgb(" + r + "," + g + "," + b + ")";
  }
}

function switchAlign() {
  let temp = textAlign.value % 3
  switch (temp) {
    case 2:
      return p5.value.RIGHT
    case 1:
      return p5.value.CENTER
    case 0:
      return p5.value.LEFT
    default:
      return p5.value.CENTER
  }
}

const saveCanvas = () => {
  if (!p5.value) {
    return
  }
  showImgLoading.value = true
  let canvas = canvasRef.value?.firstChild as HTMLCanvasElement
  console.log(canvas.toDataURL())
  // p5.value.saveCanvas('myCanvas', 'jpg');
  canvas.toBlob(async (blob) => {
    let file = new File([blob!], "fileName.jpg", { type: "image/jpeg" })
    const res = await fetch("https://dev-nft-marketplace-tqbqpbqb5a-uk.a.run.app/api/v1/files/generate_upload_url", {
      body: JSON.stringify({
        category: "user_profile_image",
        "content_type": "image/jpeg",
        "number_of_resource": 1
      }),
      method: 'post'
    })
    json = await res.json();
    googleImageJson.value = json[0]
    const res2 = await fetch(json[0]['upload_url'], {
      body: file,
      headers: {
        'content-type': 'image/jpeg'
      },
      method: 'put'
    })
    imgUrl.value = json[0]['download_url']
    showImgLoading.value = false
  }, 'image/jpeg');

}



export const useP5 = () => {
  watch(wrapMode, (oldObj, newObj) => {
    if (oldObj != newObj) {
      p5.value.remove()
      p5.value = new P5(script)
    }
  });
  watch(fileImage, (oldObj, newObj) => {
    if (oldObj != newObj) {
      p5.value.remove()
      p5.value = new P5(script)
    }
  });
  watch(bgColor, (oldObj, newObj) => {
    if (oldObj != newObj) {
      p5.value.remove()
      p5.value = new P5(script)
    }
  });

  onMounted(() => {
    p5.value = new P5(script)
  })
  return { wrapMode, saveCanvas }
}

const script = function (p5: P5) {
  // - set image

  // NOTE: Set up is here   
  p5.setup = () => {
    var canvas = p5.createCanvas(450, 400)
    canvas.parent("p5Canvas")
    p5.background(hexToRGB(bgColor.value))
    // --image
    if (fileImage.value) {
      // blob:http://localhost:3000/9e15a544-69e0-4093-b2ce-a10d72382d41
      p5.loadImage(fileImage.value, img => {
        p5.image(img, 0, (p5.height - 450 * img.height / img.width) / 2, 450, 450 * img.height / img.width);
      });
    }
  }
  // p5.windowResized = () => {
  //   p5.resizeCanvas(500, 500);
  // }
  // NOTE: Draw is here
  p5.draw = () => {
    if (!fileImage.value) {
      p5.background(hexToRGB(bgColor.value))
    }



    p5.textSize(40)


    // -- text
    // p5.textSize(40)
    p5.fill(hexToRGB(textColor.value))
    p5.textFont("Walter Turncoat")
    p5.textWrap(wrapMode.value ? p5.CHAR : p5.WORD)
    p5.text(inputText.value, 20, 100, 480, 500);
    p5.textAlign(switchAlign())
  }
}

