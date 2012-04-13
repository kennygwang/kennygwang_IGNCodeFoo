var calcPlates = function() {
    
    document.getElementById("input").focus();       // highlight the text field after hitting the submit button or pressing enter
    document.getElementById("input").select();
    
    var population = document.getElementById("input").value;       // get the population value from the text field
    
    if(!$.isNumeric(population) || population == 0) {              // verify that the user input a positive numeric value for population. also, why doesn't === work?
        alert("Your population must be a positive number. Nice try, though.")
        return;
    }
    
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
    /*------------------------------------------------------------------------------------------------------------------------------------------------------*/
    var x = 1;
    var y = 0;
    while(Math.pow(10,x) < population) {      // find greatest power of 10 less than target. this creates the "upper bound length" since you need more powers of 10 than powers of 26 to reach the target. The solution pattern will have a length of either the lower bound or upper bound, or the special case of powers of 10
        x++;
    }
    if(Math.pow(10,x) != population) x--;     // above loop found least power of 10 greater than target, minus one is greatest power smaller than the target (unless it found exactly the number)
    
    var pow10 = 0;
    while(Math.pow(10,pow10) < population){    // find least power of 10 greater than target. the powers of 10 don't necessarily help predict the length of the solution patern, so I call them "special cases"
        pow10++;
    }
    
    var a = 1;
    var b = 0;
    while(Math.pow(26,a) < population) {     // find smallest power of 26 greater than target. this creates the "lower bound length" since you need less powers of 26 than powers of 10 to reach the target
        a++;
    }
    
    /*------------------------------------------------------------------------------------------------------------------------------------------------------*/
    
    while(Math.pow(10,x)*Math.pow(26,y) < population) {                 // Swap digits for letters until greater than the target
        if(Math.pow(10,x)*Math.pow(26,y) === population) {break;}       // If you ever hit the target population exactly, stop what you're doing and move on
        x--;
        y++;
        if(x < 0) break;                                                // your exponents should never be negative, but e.g. for the case of population of 27, this occurs
    }
    
    while(Math.pow(26,a)*Math.pow(10,b) > population) {                 // Swap letters for digits until less than the target
        if (Math.pow(26,a)*Math.pow(10,b) === population) break;        // If you ever hit the target population exactly, stop what you're doing and move on (i don't think that ever happens in this loop, but I included this to be safe)
        a--;
        b++;
        if(a < 0) break;                                                // your exponents should never be negative, but e.g. for the case of population of 27, this occurs
    }
    if(Math.pow(26,a)*Math.pow(10,b) != population) {                   // The above while loop iterates one time too much, so step back one (unless it hit the target exactly, in that case it's fine the way it is)
        a++;
        b--;
    }
    
    /*------------------------------------------------------------------------------------------------------------------------------------------------------*/
    
    var nDigits = 1;                                                // stores the # of digits for output later
    var nLetters = 1;                                               // stores the # of letters for output later
    var totalPlates;                                                // stores the # of plates produced for output later
    var excess1 = Math.pow(10,x)*Math.pow(26,y) - population;       // excess plates from the "upper bound length" pattern
    var excess2 = Math.pow(26,a)*Math.pow(10,b) - population;       // excess plates from the "lower bound length" pattern
    var excess3 = Math.pow(10, pow10) - population;                 // excess plates from the "special cases" pattern
    
    if(x >= 0 && (excess1 <= excess2) && (excess1 <= excess3)) {    // find out which pattern has the least excess, and set variables accordingly
        nDigits = x;
        nLetters = y;
        totalPlates = Math.pow(10,x)*Math.pow(26,y);
    }
    else if (excess2 < excess3) {
       nLetters = a;
       nDigits = b;
       totalPlates = Math.pow(26,a)*Math.pow(10,b);
    }
    else {
        nLetters = 0;
        nDigits = pow10;
        totalPlates = Math.pow(10,pow10);
    }
    
    var digitLabel = " numbers, ";
    var letterLabel = " letters";
    
    if(nDigits === 0) digitLabel = "";
    else if(nDigits === 1) digitLabel = digitLabel.replace("s", "");
    if(nLetters === 0) {digitLabel = digitLabel.replace(", ", ""); letterLabel = "";}
    else if(nLetters === 1) letterLabel = letterLabel.replace("s", "");
    
    $("#population").text(population);                                     // the final output, using jQuery
    $("#pattern").text((nDigits > 0 ? nDigits : "") + digitLabel + (nLetters > 0 ? nLetters : "") + letterLabel);
    $("#total").text(totalPlates);
    $("#excess").text(totalPlates - population);
    return; 
};
