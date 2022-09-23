

const list_of_mrt = [
    "Yishun",
"Yio Chu Kang",
"Yew Tee",
"Woodleigh",
"Woodlands South",
"Woodlands North",
"Woodlands",
"Upper Changi",
"Ubi",
"Tuas West Road",
"Tuas Link",
"Tuas Crescent",
"Toa Payoh",
"Tiong Bahru",
"Telok Blangah",
"Telok Ayer",
"Tanjong Pagar",
"Tanah Merah",
"Tan Kah Kee",
"Tampines West",
"Tampines East",
"Tampines",
"Tai Seng",
"Stevens",
"Stadium",
"Somerset",
"Sixth Avenue",
"Simei",
"Serangoon",
"Sengkang",
"Sembawang",
"Rochor",
"Redhill",
"Raffles Place",
"Queenstown",
"Punggol",
"Promenade",
"Potong Pasir",
"Pioneer",
"Paya Lebar",
"Pasir Ris",
"Pasir Panjang",
"Outram Park",
"Orchard",
"one-north",
"Novena",
"Nicoll Highway",
"Newton",
"Mountbatten",
"Mattar",
"Marymount",
"Marsiling",
"Marina South Pier",
"Marina Bay",
"MacPherson",
"Lorong Chuan",
"Little India",
"Lavender",
"Lakeside",
"Labrador Park",
"Kranji",
"Kovan",
"King Albert Park",
"Khatib",
"Kent Ridge",
"Kembangan",
"Kallang",
"Kaki Bukit",
"Jurong East",
"Joo Koon",
"Jalan Besar",
"Hougang",
"Holland Village",
"Hillview",
"Haw Par Villa",
"HarbourFront",
"Gul Circle",
"Geylang Bahru",
"Fort Canning",
"Farrer Road",
"Farrer Park",
"Expo",
"Eunos",
"Esplanade",
"Downtown",
"Dover",
"Dhoby Ghaut",
"Dakota",
"Commonwealth",
"Clementi",
"Clarke Quay",
"City Hall",
"City Hall",
"Choa Chu Kang",
"Chinese Garden",
"Chinatown",
"Changi Airport",
"Cashew",
"Canberra",
"Caldecott",
"Buona Vista",
"Bukit Panjang",
"Bukit Gombak",
"Bukit Batok",
"Bugis",
"Buangkok",
"Bras Basah",
"Braddell",
"Botanic Gardens",
"Boon Lay",
"Boon Keng",
"Bishan",
"Bendemeer",
"Bencoolen",
"Bedok Reservoir",
"Bedok North",
"Bedok",
"Beauty World",
"Bayfront",
"Bartley",
"Ang Mo Kio",
"Aljunied",
"Admiralty",
]




//_______________________SEARCHBAR_______________________________
$('#searchbar').on('input',function() {

    const input_string = $(this).val();

    //if searchbar empty, hide suggestions
    if($(this).val()==0){
        $(".suggestion_container").hide();
        console.log('hodden');
    }
    else{

        //display suggestions when there is input
        $(".suggestion_container").show();

        
        //choose what suggestions to show from mrt list depending on user input
        const display_list =[];
        list_of_mrt.forEach(item =>{
            var checker = true;
            for (let index = 0; index < input_string.length; index++) {
                console.log(item[index])
                console.log(input_string[index])
                if (item[index].toUpperCase() != input_string[index].toUpperCase()){
                    checker = false;
                }
            }
            //if letters match, add into display list
            if (checker){
                display_list.push(item);
            }
            
        })

        //A second filter method 
        function check_input(mrt){
            
            return mrt.includes( input_string );
     
        }
        filtered_list = list_of_mrt.filter(check_input);

        //---------------render the suggestions to user------------------
        //clear suggestions
        $(".inner_suggestion_container").empty()

        //render new elements
        if (display_list.length <= 5){
            display_list.forEach(element => {
                create_suggest(element)
            });
        }
        else{
            for (let index = 0; index < 5; index++) {
                create_suggest(display_list[index],index)
                
            }
        }


    }
    
})

//function to create suggestions for search bar
function create_suggest(suggestion,index){

    //create suggestions
    var suggestion_div = '<button type="button" class="list-group-item list-group-item-action list-group-item-' + index + ' ">'+ suggestion + '</button>';
    console.log(suggestion_div)
    $(".inner_suggestion_container").append(suggestion_div);
    const button = ".list-group-item-"+index

    //help user fill up search bar when button is clicked, then hide search bar
    $(button).on("click",function(){
        $("#searchbar").val(suggestion)
        $(".suggestion_container").hide()
    })
}



//checks for valid input
$("#search_form").submit(function(event){
    const letters = /[A-Za-z]/
    const nums = /^[0-9]*$/
        // /\w/
    if(! ($("#searchbar").val().match(letters)) ){
        alert('please type letters instead :)')
        event.preventDefault()
    }
})