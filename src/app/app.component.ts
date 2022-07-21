import {Component, OnInit} from '@angular/core';
import {Month} from "./month.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tilt = 23.43;
  latitude = 0;
  months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  monthsArray: Month[] = [];
  monthsDays = [31, 28, 31, 30, 31, 30,
    31, 31, 30, 31, 30, 31];
  dayNum = 0;
  date = 0;
  selectedMonth: Month = new Month(0, "January");
  prevX = 0;
  prevY = 0;
  sunRed = 0;
  sunGreen = 0;
  sunBlue = 0;
  coloringStrength = 0;
  private readonly CANV_WIDTH = 500;

  ngOnInit() {
    this.inputChanged();
    this.monthsArray.push(new Month(0, "January"));
    this.monthsArray.push(new Month(1, "February"));
    this.monthsArray.push(new Month(2, "March"));
    this.monthsArray.push(new Month(3, "April"));
    this.monthsArray.push(new Month(4, "May"));
    this.monthsArray.push(new Month(5, "June"));
    this.monthsArray.push(new Month(6, "July"));
    this.monthsArray.push(new Month(7, "August"));
    this.monthsArray.push(new Month(8, "September"));
    this.monthsArray.push(new Month(9, "October"));
    this.monthsArray.push(new Month(10, "November"));
    this.monthsArray.push(new Month(11, "December"));
    this.selectedMonth = this.monthsArray[2];
  }

  getResult() {
    return this.latitude;
  }

  clickEvent() {
    this.tilt = 23.43;
    this.latitude = 0;
    this.inputChanged();
    this.clearCanvas();
  }

  inputChanged($event?: any) {
    let element = document.getElementById('line-img');
    if (element) {
      if (this.latitude == 0) {
        element.style.transform =
          'rotate(' + (this.tilt ? this.tilt : 0) + 'deg) ' +
          'translate(0px, ' + 0 + 'px)';
      }/* else {
        element.style.transform =
          'rotate(' + (this.tilt ? this.tilt : 0) + 'deg) ' +
          'translate(0px, ' + (this.latitude/Math.abs(this.latitude)) * 1.74 * -90 * Math.sqrt(1 - Math.pow(Math.abs(this.latitude) / 90 - 1, 2)) + 'px)';
      }*/
      else {
        element.style.transform =
          'rotate(' + (this.tilt ? this.tilt : 0) + 'deg) ' +
          'translate(0px, ' + 0 + 'px)';
      }
      let width = 100 * (1 - Math.abs(this.latitude) / 90);
      element.style.setProperty('width', '' + width + '%');
      element.style.setProperty('top', '' + (100 - 2 * width) + '%');
//      element.style.setProperty('left', ''+(100-width) + '%');
    }
    element = document.getElementById('equator');
    if (element) {
      element.style.transform =
        'rotate(' + (this.tilt ? this.tilt + 90 : 90) + 'deg) ' +
        'translate(0px, ' + 0 + 'px)';
      let width = 120;
      element.style.setProperty('width', '' + 5 * width + 'px');
      //   element.style.setProperty('top', ''+ 0.5*(100-width) + '%');
      //  element.style.setProperty('left', ''+ 0.5*(100-width) + '%');
    }
  }

  updateDate(m?: any) {
    console.log('this.selectedMonth=', this.selectedMonth);
    let date = 0;
    for (let i: number = 0; i < this.selectedMonth.ind; i++) {
      date += this.monthsDays[i];
    }
    date += this.dayNum;
    this.date = date;
  }

  doMath() {
    this.clearCanvas();

    let s = this.calculateSFrom0To6();

    let t = 0;
    let b = 0;
    let f = -1;

    const horizonCrossings = [-1, 1];

    let flag = 0;
    let flag2 = 0;
    for (let x: number = -1; x <= 0.01; x += .01) {
      t = 0 - Math.abs(.9 * s + (90 - .9 * this.latitude) / 90 - 1) + .9;
      b = Math.abs(.9 * s + (90 + .9 * this.latitude) / 90 - 1) - .9;
      f = (1.8 / Math.PI) * Math.asin(Math.sin(((t - b) / 1.8) * Math.PI / 2) * Math.sin(Math.PI * (x + .5))) + (t + b) / 2;

      this.drawBackground(f, x);
    }


    for (let x: number = -1; x <= 1; x += .002) {
      t = 0 - Math.abs(.9 * s + (90 - .9 * this.latitude) / 90 - 1) + .9;
      b = Math.abs(.9 * s + (90 + .9 * this.latitude) / 90 - 1) - .9;
      f = (1.8 / Math.PI) * Math.asin(Math.sin(((t - b) / 1.8) * Math.PI / 2) * Math.sin(Math.PI * (x + .5))) + (t + b) / 2;

      if (x === -1) {
        this.prevX = x * this.CANV_WIDTH + this.CANV_WIDTH;
        this.prevY = 125 - f * 125 / .9;
      }
      if (f > 0 && flag === 0) {
        horizonCrossings[0] = x;
        flag = 1;
        flag2 = 1;
      } else if (f < 0 && flag === 1) {
        horizonCrossings[1] = x;
        flag = 0;
      }
      this.draw(x, f);
    }

    if (flag2 === 0) {
      horizonCrossings[1] = -1;
    }

    let diff = horizonCrossings[1] - horizonCrossings[0];

    let element = document.getElementById('rectangle');
    if (element) {
      element.style.setProperty('width', '' + 50 * diff + '%');
    }
    element = document.getElementById('groundRectangle');
    if (element) {
      element.style.setProperty('width', '' + 50 * diff + '%');
    }
    return Math.round(1000 * (diff) * 12) / 1000;
  }

  getDate($event?: any) {
    return this.date;
  }

  updateMonthDay($event: any) {
    let numberOfDays = this.date;
    let i = 0;
    while (numberOfDays > this.monthsDays[i]) {
      numberOfDays -= this.monthsDays[i];
      i++;
    }
    this.dayNum = numberOfDays;
    this.selectedMonth = this.monthsArray[i];
  }

  getMonth() {
    console.log(this.selectedMonth);
    return this.selectedMonth.name;
  }

  private draw(x: number, f: number) {
    let c = <HTMLCanvasElement>document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    f = f / .9;
    if (ctx) {
      let newX = x * this.CANV_WIDTH + this.CANV_WIDTH;
      let newY = 125 - f * 125;

      this.sunRed = f > 0 ? 255 : 127;
      this.sunGreen = f > 0 ? 255 * Math.sqrt(Math.sqrt(1 - Math.pow(f - 1, 2))) : 0;
      this.sunBlue = f > 0 ? 255 * Math.sqrt(1 - Math.pow(f - 1, 2)) : 0;

      ctx.strokeStyle = "rgb(" + this.sunRed + "," + this.sunGreen + "," + this.sunBlue + ")";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(this.prevX, this.prevY);
      ctx.lineTo(newX, newY);
      ctx.stroke();
      this.prevX = newX;
      this.prevY = newY;
    }
  }

  clearCanvas() {
    let c = <HTMLCanvasElement>document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, c.width, c.height);
    }
  }

  formatTime() {
    let date = this.doMath();
    let returnString = Math.floor(date) + " hours";
    if (Math.round(60 * (date % 1)) !== 0) {
      returnString += ", " + Math.round(60 * (date % 1)) + " minutes";
      return "\u00A0" + this.doMath() + " \u00A0 or \u00A0 " + returnString;
    }
    return returnString;
  }

  calculateSFrom0To6() {
    let s = ((this.date + 10) / 365) % 1;
    if (s > .5) {
      s = 1 - s;
    }
    s *= 2;
    return (this.tilt / 90) * Math.sin(Math.PI * (s - .5));
  }

  drawBackground(f: number, x: number) {
    this.coloringStrength = 1 - Math.sqrt(1 - Math.pow(Math.abs(f) / .9 - 1, 2));

    let c = <HTMLCanvasElement>document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    if (ctx) {
      ctx.lineWidth = 7;
      let red = 0;
      let green = 0;
      let blue = 0;
      let brightness = 0;
      let rgb = "rgb(" + red + "," + green + "," + blue + ")";
      if (f >= -.18) {
        for (let i = 0; i < c.height / 2; i += 5) {
          let verticalGradient = 1 - Math.sqrt(1 - Math.pow(i / (.5 * c.height), 2));
          if (f < 0 && f >= -.18) {
            brightness = 2 * Math.sin((1 / .18) * (f + .18) * Math.PI / 2 - Math.PI / 2) + 2;

            let temp = 135 * verticalGradient;
            red = (1 - verticalGradient * this.coloringStrength) * (.25 * brightness * temp)
              + .5 * brightness * verticalGradient * this.coloringStrength * 255;

            temp = 191 + 15 * verticalGradient;
            green = (1 - verticalGradient * this.coloringStrength) * (.25 * brightness * temp)
              + .5 * brightness * verticalGradient * this.coloringStrength * 255
              * Math.sqrt(Math.sqrt(1 - Math.pow(Math.abs(f / .9) - 1, 2)));

            temp = 255 - 20 * verticalGradient;
            blue = (1 - verticalGradient * this.coloringStrength) * (.25 * brightness * temp)
              + .5 * brightness * verticalGradient * this.coloringStrength * 255
              * Math.sqrt(1 - Math.pow(Math.abs(f / .9) - 1, 2));

          } else {
            brightness = Math.sin(.5 * Math.PI * f / .9);

            let temp = 135 * (1 - Math.sqrt(1 - Math.pow(i / (.5 * c.height), 2)));
            red = (1 - verticalGradient * this.coloringStrength) * (.5 * brightness * temp + .5 * temp)
              + verticalGradient * this.coloringStrength * 255;

            temp = 191 + 15 * verticalGradient;
            green = (1 - verticalGradient * this.coloringStrength) * (.5 * brightness * temp + .5 * temp)
              + verticalGradient * this.coloringStrength * 255
              * Math.sqrt(Math.sqrt(1 - Math.pow(f / .9 - 1, 2)));

            temp = 255 - 20 * verticalGradient;
            blue = (1 - verticalGradient * this.coloringStrength) * (.5 * brightness * temp + .5 * temp)
              + verticalGradient * this.coloringStrength * 255
              * Math.sqrt(1 - Math.pow(f / .9 - 1, 2));

          }
          rgb = "rgb(" + red + "," + green + "," + blue + ")";
          ctx.strokeStyle = rgb;
          ctx.beginPath();
          ctx.moveTo(x * this.CANV_WIDTH + this.CANV_WIDTH, i);
          ctx.lineTo(x * this.CANV_WIDTH + this.CANV_WIDTH, i + 5);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(this.CANV_WIDTH - x * this.CANV_WIDTH, i);
          ctx.lineTo(this.CANV_WIDTH - x * this.CANV_WIDTH, i + 5);
          ctx.stroke();
        }
      } else {      // it must be negative and below -18
        rgb = "rgb(" + red + "," + green + "," + blue + ")";
        ctx.strokeStyle = rgb;
        ctx.beginPath();
        ctx.moveTo(x * this.CANV_WIDTH + this.CANV_WIDTH, 0);
        ctx.lineTo(x * this.CANV_WIDTH + this.CANV_WIDTH, c.height / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.CANV_WIDTH - x * this.CANV_WIDTH, 0);
        ctx.lineTo(this.CANV_WIDTH - x * this.CANV_WIDTH, c.height / 2);
        ctx.stroke();
      }

      red = 0;
      green = 94 / 4;
      blue = 255 / 4;
      brightness = 0;

      if (f < 0 && f >= -.18) {
        brightness = 2 * Math.sin((1 / .18) * (f + .18) * Math.PI / 2 - Math.PI / 2) + 1;
        green = Math.max(94 / 4 + brightness * 94 / 4, 94 / 4);
        blue = Math.max(255 / 4 + brightness * 255 / 4, 255 / 4);
      }
      if (f >= 0) {
        brightness = Math.sin(.5 * Math.PI * f / .9);
        green = 94 / 2 + 2 * brightness * 94 / 4;
        blue = 255 / 2 + 2 * brightness * 255 / 4;
      }
      rgb = "rgb(" + red + "," + green + "," + blue + ")";
      ctx.strokeStyle = rgb;
      ctx.beginPath();
      ctx.moveTo(x * this.CANV_WIDTH + this.CANV_WIDTH, c.height / 2);
      ctx.lineTo(x * this.CANV_WIDTH + this.CANV_WIDTH, c.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(this.CANV_WIDTH - x * this.CANV_WIDTH, c.height / 2);
      ctx.lineTo(this.CANV_WIDTH - x * this.CANV_WIDTH, c.height);
      ctx.stroke();
    }
  }
}
