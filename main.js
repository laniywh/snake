
var gridWidth = 20,
    gridHeight = 20,
    square = '<div class="square"></div>',
    squareClr = '<div class="square clear"></div>',
    container = $('.grid'),
    squareClass = $('.square'),
    bgColor = '#2B2A28',
    snakeColor = 'yellow',
    foodColor = 'white';

$(document).ready(function() {

  var snake = (function() {
    var direction = 'r';
    var parts = [[3,1], [2,1], [1,1]];
    var length = 3;
    var speed = 300;

    var score = 0;
    var ptIncrease = 10;
    var lv = 0;
    var scoreHolder = $('#scoreHolder');

    // move snake in current direction ev speed ms
    var run = setInterval(function() {move();}, speed);

    var init = function() {
      // show score
      scoreHolder.html(score);

      // draw initial snake
      for (var i = 0; i < length; i++) {
        var nthChild = pos(parts[i]);
        part = container.children().eq(nthChild);
        part.css("background-color", snakeColor);
      }

      generateFood();

      $(document).keydown(function(e) {
        switch (e.which) {
          case 39:
            if (!overlap('r')) {
              direction = 'r';
            }
            break;

          case 40:
            if (!overlap('d')) {
              direction = 'd';
            }
            break;

          case 37:
            if (!overlap('l')) {
              direction = 'l';
            }
            break;

          case 38:
            if (!overlap('u')) {
              direction = 'u';
            }
            break;

          default:
        }

      });

    };

    var generateFood = function() {
      var nthChild;

      do {
        // random num from 0 to gridWidth * gridHeight
        nthChild = Math.floor(Math.random() * gridWidth * gridHeight);
      } while (foodOnSnake(nthChild + 1));

      foodDiv = container.children().eq(nthChild);
      foodDiv.css("background-color", foodColor);

      food = coord(nthChild + 1);
    };

    // return true if food is on the snake, else false
    var foodOnSnake = function(nthChild) {
      var foodCoord = coord(nthChild);

      for (var i = 0; i < length; i++) {
        if (compareCoord(parts[i], foodCoord)) {
          return true;
        }
      }

      return false;
    };

    // Check if new head will overlap its second part
    // Prevent snake from going in the opposite direction
    var overlap = function(d) {
      if (length < 2)
        return false;

      // head = parts[0];
      var newHead = getNewHeadCoord(d);

      if (newHead[0] == parts[1][0] && newHead[1] == parts[1][1]) {
        return true;
      } else {
        return false;
      }
    };

    // Return new head coordinate based on the direction
    var getNewHeadCoord = function(d) {
      var oldHead = parts[0];
      var newHead = oldHead;

      switch (d) {
        case 'r':
          newHead = [oldHead[0]+1, oldHead[1]];
          break;

        case 'l':
          newHead = [oldHead[0]-1, oldHead[1]];
          break;

        case 'u':
          newHead = [oldHead[0], oldHead[1]-1];
          break;

        case 'd':
          newHead = [oldHead[0], oldHead[1]+1];
          break;
      }

      return newHead;
    };


    // update parts of snake after one move
    var move = function() {
      var newHead = getNewHeadCoord(direction);

      // check if new head valid
      if (badMove(newHead)) {
        console.log('Game Over!');
        clearInterval(run); // stop loop
        return;
      }

      update(newHead);

    };

    var updateScore = function() {
      score = score + lv * ptIncrease;
      scoreHolder.html(score);
    };

    // update snake
    var update = function(head) {
      var oldTail = parts[length-1];

      // add new head
      parts.unshift(head);
      dot = container.children().eq(pos(head));
      dot.css('background-color', snakeColor);

      if (eatFood(head)) {
        length++;
        generateFood();
        lv++;

        // increase speed
        speed = speed * (1 - 0.05);
        console.log(`speed: ${speed}`);
        clearInterval(run); // stop loop
        run = setInterval(function() {move();}, speed);

        updateScore();
      } else {
        // remove tail
        parts.pop();
        dot = container.children().eq(pos(oldTail));
        dot.css('background-color', bgColor);
      }
    };

    // return true if eat food, else false
    var eatFood = function(newHead) {
      if (compareCoord(newHead, food)) {
        return true;
      } else {
        return false;
      }
    };

    var badMove = function(head) {
      // out of grid
      if (head[0] > gridWidth || head[0] < 1 || head[1] > gridHeight || head[1] < 1) {
        return true;
      }

      // hit itself (5th part and beyond)
      if (findPart(head)) {
        return true;
      }

      return false;
    };

    // if found: return true
    // else return false
    var findPart = function(coord) {
      // can only hit 3rd and beyond
      for (var i = 3; i < length; i++) {
        if (compareCoord(coord, parts[i])) {
          return true;
        }
      }

      return false;
    };

    // return true if same coordinate, else false
    var compareCoord = function(coord1, coord2) {
      if (coord1[0] == coord2[0] && coord1[1] == coord2[1]) {
        return true;
      }

      return false;
    };


    // return position (starting from 0) of a coordinate
    var pos = function(coord) {
      return gridWidth * (coord[1] - 1) + coord[0] - 1;
    };

    // return coordinate of a position (starting from 1)
    var coord = function(pos) {
      // not at last column
      if (pos % gridWidth) {
        return [pos % gridWidth, Math.floor(pos / gridWidth) + 1];
      } else {
        return [gridWidth, Math.floor(pos / gridWidth)];
      }
    };

    return {
      init: init,
    };

  })();

  var grid = (function() {
    for (var i = 0; i < gridHeight; i++) {
      container.append(squareClr);

      for (var j = 1; j < gridWidth; j++) {
        container.append(square);
      }
    }

    snake.init();
  })();
});
