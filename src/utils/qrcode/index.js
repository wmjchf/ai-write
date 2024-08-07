import extend from "extend";
import { QRCode, QRErrorCorrectLevel } from "./draw";

// support Chinese
function utf16to8(str) {
  var out, i, len, c;
  out = "";
  len = str.length;
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x0001 && c <= 0x007f) {
      out += str.charAt(i);
    } else if (c > 0x07ff) {
      out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
    } else {
      out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
    }
  }
  return out;
}

function drawQrcode(options, debug) {
  options = options || {};
  options = extend(
    true,
    {
      canvasId: "poster",
      // canvas: canvas,
      text: "爱一个人就要勇敢说出来",
      width: 260,
      height: 260,
      padding: 20,
      // paddingColor: '#ffffff', // 默认与background一致
      typeNumber: -1,
      correctLevel: QRErrorCorrectLevel.H,
      background: "#ffffff",
      foreground: "#000000",
      image: {
        imageResource: "",
        width: 80,
        height: 80,
        round: true,
      },
    },
    options
  );

  if (!options.canvasId && !options.canvas) {
    console.warn("please set canvasId or canvas!");
    return;
  }

  if (!options.paddingColor) options.paddingColor = options.background;

  if (debug) {
    var qrcode = new QRCode(options.typeNumber, options.correctLevel);
    qrcode.addData(utf16to8(options.text));
    qrcode.make();

    return new Promise(function (resolve) {
      resolve(qrcode);
    });
  } else {
    return new Promise(function (resolve) {
      return resolve(createCanvas());
    });
  }

  function createCanvas() {
    // create the qrcode itself
    const qrcode1 = new QRCode(options.typeNumber, options.correctLevel);
    qrcode1.addData(utf16to8(options.text));
    qrcode1.make();

    var dpr = 1;
    // #ifdef MP-WEIXIN
    dpr = wx.getSystemInfoSync().pixelRatio;
    // #endif

    var canvas = options.canvas;
    const ctx = canvas.getContext("2d");
    canvas.width = options.width * dpr;
    canvas.height = options.width * dpr;
    const width = canvas.width;

    // 背景色
    ctx.fillStyle = options.paddingColor;
    ctx.fillRect(
      0,
      0,
      width + options.padding * 2,
      width + options.padding * 2
    );

    var tileW = (width - options.padding * 2) / qrcode1.getModuleCount();
    var tileH = (width - options.padding * 2) / qrcode1.getModuleCount();

    // 开始画二维码
    for (var row = 0; row < qrcode1.getModuleCount(); row++) {
      for (var col = 0; col < qrcode1.getModuleCount(); col++) {
        ctx.fillStyle = qrcode1.isDark(row, col)
          ? options.foreground
          : options.background;
        var w = Math.ceil((col + 1) * tileW) - Math.floor(col * tileW);
        var h = Math.ceil((row + 1) * tileW) - Math.floor(row * tileW);
        ctx.fillRect(
          Math.round(col * tileW) + options.padding,
          Math.round(row * tileH) + options.padding,
          w,
          h
        );
      }
    }

    if (options.image.imageResource) {
      const imgW = options.image.width * dpr;
      const imgH = options.image.height * dpr;
      const dx = (width - imgW) / 2;
      const dy = (width - imgH) / 2;
      if (options.image.round) {
        // Logo边框
        const imgW2 = options.image.width * dpr + 30;
        const dx2 = (width - imgW2) / 2;
        const r2 = imgW2 / 2;
        const cx2 = dx2 + r2;
        ctx.beginPath();
        ctx.arc(cx2, cx2, r2, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.restore();

        // 画Logo
        const r = imgW / 2;
        const cx = dx + r;
        const cy = dy + r;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.clip();

        ctx.drawImage(options.image.imageResource, dx, dy, imgW, imgW);
        ctx.restore();
      } else {
        ctx.drawImage(options.image.imageResource, dx, dy, imgW, imgH);
        ctx.restore();
      }
    }

    return ctx;
  }
}

export default drawQrcode;
