let rects = [];
let isDragging = false;
let xOffset, yOffset;
let selectedRect = null;

let roleRectColor = '#20B9F2';
let descriptionRectColor = '#FFBB5A';
let resultRectColor = '#58CA96';


function setup() {
    createCanvas(windowWidth, windowHeight);
    //内容矩形定义 & init
    rects = [
        {x: 50, y: 50, width: 120, height: 100, text: '小说家', type: 'roleRect', label: '你的角色', input: null},
        {x: 200, y: 50, width: 250, height: 100, text: '写一个青春期少年的故事', type: 'descriptionRect', label: '你的任务描述', input: null},
        {x: 480, y: 50, width: 400, height: 100, text: '少年遇到的烦恼', type: 'descriptionRect', label: '一些中间过程', input: null},
        {x: 50, y: 200, width: 400, height: 100, text: '少年的爱情', type: 'descriptionRect', label: '一些中间过程', input: null},
        {x: 480, y: 200, width: 400, height: 100, text: '少年的冲动', type: 'descriptionRect', label: '一些中间过程', input: null},
        {x: 50, y: 350, width: 400, height: 100, text: '故事的时间', type: 'resultRect', label: '最终结果', input: null},
        {x: 480, y: 350, width: 400, height: 100, text: '故事', type: 'resultRect', label: '最终结果', input: null}];
}

function mousePressed() {
    for(let rectObj of rects) {
        if(mouseX > rectObj.x && mouseX < rectObj.x + rectObj.width &&
            mouseY > rectObj.y && mouseY < rectObj.y + rectObj.height){
            isDragging = true;
            selectedRect = rectObj;
            xOffset = mouseX - rectObj.x;
            yOffset = mouseY - rectObj.y;
            break;
        }
    }
}

function mouseDragged() {
    if (isDragging) {
        selectedRect.x = mouseX - xOffset;
        selectedRect.y = mouseY - yOffset;
    }
}

function mouseReleased() {
    isDragging = false;
    selectedRect = null;
}

function draw() {
    background(250);
    for (let rectObj of rects) {
        if(rectObj.type === 'roleRect'){
            fill(roleRectColor);
        }else if(rectObj.type === 'descriptionRect'){
            fill(descriptionRectColor);
        }else if(rectObj.type === 'resultRect'){
            fill(resultRectColor);
        }
        rect(rectObj.x, rectObj.y, rectObj.width, rectObj.height);

        // 计算文本框的位置，使其在长方形内，比长方形小10像素
        let inputX = constrain(rectObj.x + 10, 0, width - rectObj.width - 20);
        let inputY = constrain(rectObj.y + 10, 0, height - rectObj.height - 20);
        let inputWidth = rectObj.width - 28;
        let inputHeight = rectObj.height - 26;

        // 创建或更新文本框，并将其置于长方形之上
        if(rectObj.input){
            rectObj.input.position(inputX, inputY);
            rectObj.input.size(inputWidth, inputHeight);
        }else{
            rectObj.input = createDiv(`<textarea style="height: 100%; width: 100%; border: none; background-color: transparent; outline: none; resize:none; ">${rectObj.text}</textarea>`);
            rectObj.input.position(inputX, inputY);
            rectObj.input.elt.style.zIndex = "1";
            // 添加事件监听器监听文本变化
            rectObj.input.elt.querySelector('textarea').addEventListener('input', function() {
                rectObj.text = this.value;
            });
        }

        //计算标题的位置
        let labelX = rectObj.x;
        let labelY = rectObj.y - 24;

        // 创建或更新不可编辑文本
        if (rectObj.labelElement) {
            rectObj.labelElement.position(labelX, labelY);
        } else {
            rectObj.labelElement = createDiv(rectObj.label);
            rectObj.labelElement.style('font-size: 14px;')
            rectObj.labelElement.position(labelX, labelY);
            rectObj.labelElement.elt.style.zIndex = "1";
        }
    }
}
