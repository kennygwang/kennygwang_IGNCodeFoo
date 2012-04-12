var calcPlates = function() {
    var population = document.getElementById("input").value;
    var nDigits = 1;            // # of digits
    var nLetters = 1;           // # of letters
    var totalPlates;
    
    if(population <= 10) {                      // the "base cases" need no calculation
        $("#population").text(population);
        $("#pattern").text("1 number");
        $("#total").text(10);
        $("#excess").text(10 - population);
        return;
    }
    if(population <= 26) {                      // the "base cases" need no calculation
        $("#population").text(population);
        $("#pattern").text("1 letter");
        $("#total").text(26);
        $("#excess").text(26 - population);
        return;
    }
    
    var x = 1;
    var y = 0;
    while(Math.pow(10,x) < population) {      // find greatest power of 10 less than target 
        x++;
    }
    if(Math.pow(10,x) != population) x--;     // above loop found least power of 10 greater than target, minus one is greatest power smaller than the target
    
    var a = 1;
    var b = 0;
    while(Math.pow(26,a) < population) {     // find smallest power of 26 greater than target
        a++;
    }
    
    while(Math.pow(10,x)*Math.pow(26,y) < population) {
        if(Math.pow(10,x)*Math.pow(26,y) === population) {break;}
        x--;
        y++;
        if(x < 0) break;                    // for the case of pop: 27
    }
    
    while(Math.pow(26,a)*Math.pow(10,b) > population) {
        if (Math.pow(26,a)*Math.pow(10,b) === population) {break;}
        a--;
        b++;
        if(a < 0) break;                    // that's as low as your number will go. case of pop: 27, for example
    }
    if(Math.pow(26,a) != population) {
        a++;
        b--;
    }
    
    var excess1 = Math.abs([Math.pow(10,x)*Math.pow(26,y) - population]);
    var excess2 = Math.abs([Math.pow(26,a)*Math.pow(10,b) - population]);
    if(x >= 0 && (excess1 <= excess2)) {
        nDigits = x;
        nLetters = y;
        totalPlates = Math.pow(10,x)*Math.pow(26,y);
    }
    
    else {
       nLetters = a;
       nDigits = b;
       totalPlates = Math.pow(26,a)*Math.pow(10,b);
    }
    
    $("#population").text(population);
    $("#pattern").text(nDigits + "numbers, " + nLetters + " letters");
    $("#total").text(totalPlates);
    $("#excess").text(totalPlates - population);
    return; 
    
    //$("#population").append("population");
};
