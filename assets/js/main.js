// dodaj sadržaj u json

//alert("ok");
let categories=[];
let destinations=[];
let favourites=[];
 let getDestination=[];
const FAVOURITES="favourite_offer";
let categoriesReady=false;
let destinationReady=false;
let isActive=false;
let perPage=4;  /////////////////////////////////////////////////////////////////////////////////////////////////////////// PPROMENI OVAJ BROJ

const nav=["Početna", "Ponude", "Kontakt", "Autor"];
const navLinks=["index.html", "offers.html", "contact.html", "author.html"];
const countryImage=["assets/img/rusija22.jpeg","assets/img/italija22.jpeg","assets/img/turska22.jpeg","assets/img/portugal22.jpeg"];
const countryImagesAlt=["rusija", "italija", "turska", "portugal"];
var logoImage="assets/img/logo1.png"; 

$(document).ready(function(){
    getFavourites();
    favInfo();
    loadDestination();
    loadCategories();
    hamburger();
    showPictures(countryImage, countryImagesAlt);
    showFooter();
    $("#searchDestination").on("input", allFilters);
    $("#filterCountry").on("change", allFilters);
    $("#filterCategory").on("change", allFilters);
    $("#sort").on("change", allFilters);
    $("#dateOffer").on("change", allFilters);
   
});

function loadDestination(){
    $.ajax({
        url:"assets/data/destination.json",
        method:"GET",
        dataType:"json",
        success:function(data){
            try{
                destinations=data;
                console.log(destinations);
                destinationReady=true;
                renderIfReady();
                renderCountries(destinations);
            }
            catch(error){
                console.error("Greška.", error.message);
            }
        },
        error: function(xhr){
            console.log(xhr);
        }
    });
}
function loadCategories(){
    $.ajax({
        url:"assets/data/categories.json",
        method:"GET",
        dataType:"json",
        success: function(data){
            try{
                categories=data;
                console.log(categories);
                categoriesReady=true;
                renderIfReady();
                renderCategories(categories);
            }
           catch(error){
            console.error("Greška.", error.message);
           }
        },
        error: function(xhr){
            console.log(xhr);
        }
    });
}



function renderIfReady(){
    if(destinationReady && categoriesReady){
        cleanFavourites();
        if($("#offersIndex").length){
            let topFour=destinations.slice(0,4);
            renderAllOffers(topFour, "#offersIndex")
        }
       if($("#allOffers").length){
            allFilters();
        }
        if($("#detailPage").length){
            showDetails();
        }
        if($("#infoDestination").length){
            showBookingInfo();
        }
        
       //renderAllOffers(destinations);
       //pagination(1);
    }
}          


function hamburger(){
    let navHtml = `
        <div class="container-fluid">
            <a href="index.html" class="navbar-brand">
                <img src="${logoImage}" class="logoImg" alt="logo"/>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#glavniMeni">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="glavniMeni">
                ${renderMenu(nav, navLinks, false)}
            </div>
        </div>`;
    
    $(".navigation").html(navHtml);
}

function renderMenu(nav, navLinks, isFooter){
    let listClass = isFooter ? "footer-nav-list" : "navbar-nav";
    let linkClass = isFooter ? "footer-link" : "nav-link";
    let html=`<ul class="${listClass}">`
    for(let i=0;i<nav.length;i++){
        html+=`
            <li class="nav-item"><a href="${navLinks[i]}" class="${linkClass}">${nav[i]}</a></li>
          `
    }
    html+=`</ul>`
    return html;
}



// formatiranje datuma
function formatDate(dates){ 
    console.log("formatiram:", dates);
    let skloniCrtu=dates.split("-");
     console.log(skloniCrtu);
   
    return `${skloniCrtu[2]}.${skloniCrtu[1]}.`;
}

// prikaz slika na index stranici
function showPictures(countryImage, countryImagesAlt){
    let html="";

    for(let i=0;i<countryImage.length;i++){
        html+=`
        <div class="col-xl-3 col-md-6 col-12 ">
        <img src="${countryImage[i]}" alt="${countryImagesAlt[i]}"/>
        </div>`
    };
    $("#countriesImages").html(html);                                                           
};

function showFooter(){
    let html="";
    html+=`
        <section id="footer-main" class="row d-flex justify-content-center align-items-center mt-5 mb-4 gap-4">
            <article id="logo-footer" class="me-4 col-lg-3 col-11 d-flex flex-column justify-content-center align-items-center">
                <a href="index.html"><img src="${logoImage}" alt="logo" class="logoImg"/></a>
                <p class="mt-3 mb-1">Turistička agencija</p>
                <p>"Oko sveta"</p>
            </article>
            <article class="col-lg-3 col-11 d-flex flex-column justify-content-center align-items-center">${renderMenu(nav, navLinks, true)}</article>
            <article id="footer-contact" class="col-lg-3 col-11 d-flex flex-column justify-content-center align-items-center">
                <h3>Kontaktirajte nas</h3>
                <div class="d-flex gap-2"><i class="fa-solid fa-phone mt-1"></i><p>628745963</p></div>
                <div class="d-flex gap-2"><i class="fa-solid fa-envelope mt-1"></i><p>okosveta@gmail.com</p></div>
                <div class="d-flex gap-2"> <i class="fa-solid fa-location-dot mt-1"></i> <p>Braće Jovanovovića, Pančevo</p></div>
            </article>
        </section>
        <div class="d-flex justify-content-center align-items-center">
            <p>&copy 2026 ALL RIGHTS RESERVED</p>
            <p> | </p>
			<p>DEVELOPED BY OKO SVETA<p>
        </div>
    `;
    $("footer").html(html);
}

//offers.html                                   
function renderAllOffers(destinations, element){
    let html="";
    destinations.forEach(d=>{
        let mapDates=d.dates.map(dates=>formatDate(dates)).join(" | ");
        let cat=categories.find(c=>c.id==d.categoryId);
        let addOrRemove=favourites.includes(d.id)? `<i class="fa-solid fa-heart fa-lg"></i>` : `<i class="fa-regular fa-heart fa-lg"></i>`;
        html+=`
        <div class="col-lg-3 col-md-6 col-12 d-flex">
            <div class="d-flex flex-column cardTopOffer h-100">
                <img src="${d.firstImage}" alt="${d.alt}"/>
                <div class="ps-2">
                    <h3 class="pt-3">${d.city}</h3>
                    <h4>${d.country}</h4>
                    <p class="fs-5 mt-3 mb-1">${cat.name} - ${d.days==1?`${d.days} dan`: `${d.days} dana`} </p>
                    <p class="fs-5">Datum: ${mapDates}</p>
                    <h4>${d.price} €</h4>
                    <div class="addToFavourites fs-5" data-id="${d.id}">${addOrRemove} Dodaj u omiljeno</div>
                    <a href="details.html?id=${d.id}" class="text-white text-decoration-none d-inline-block pb-2 mt-2 fs-5">Detalji</a>
                </div>
            </div>
        </div>
        `;
    })
    $(element).html(html);

}

//ispis kategorija kao option
function renderCategories(categories){
    let html="";
    categories.forEach(c=>{
        html+=`<option value="${c.id}">${c.name}</option>`;
    })
    let container=$("#filterCategory");
    container.append(html);
}
//ispis drzava kao option
function renderCountries(destinations){
    let html="";
    let countries=[];
    destinations.forEach(d=>{
        if(!countries.includes(d.country)){
        countries.push(d.country);
        html+=`<option value="${d.country}">${d.country}</option>`;
    }
}) 
    let container=$("#filterCountry");
    container.append(html);
}


function allFilters(){
    getDestination=[...destinations];
    
    //search
    const searchDestination=$("#searchDestination").val().toLowerCase();
    getDestination=getDestination.filter(d=>d.country.toLowerCase().includes(searchDestination)||d.city.toLowerCase().includes(searchDestination));

    //filtiranje ponuda po državi
    const filterCountry=$("#filterCountry").val();
    if(filterCountry!="all"){
        getDestination=getDestination.filter(d=>d.country==filterCountry);
    }
    

    //filtriranje ponuda po kategoriji
    const filterCategory=$("#filterCategory").val();
    if(filterCategory!="all"){
        getDestination=getDestination.filter(d=>d.categoryId==parseInt(filterCategory));
    }

    //sortiranje 
    const sortDestination=$("#sort").val();
    switch(sortDestination){
        case "countryAsc": getDestination.sort((a, b)=>a.country.localeCompare(b.country));
        break;
        case "priceAsc": getDestination.sort((a, b)=>a.price-b.price);
        break;
        case "priceDesc": getDestination.sort((a,b)=>b.price-a.price);
        break;
        case "default": break;                
    }
    // filtriranje po datumu
    const selectedDate=$("#dateOffer").val();
    if(selectedDate){
        getDestination=getDestination.filter(d=>d.dates.includes(selectedDate));
    }
    
    if(isActive){
        getDestination=getDestination.filter(d=>favourites.includes(d.id));
    }

    pagination(1);
}

function getFavourites(){
    try{
        let fav=localStorage.getItem(FAVOURITES);
        if(fav){
        favourites=JSON.parse(fav);
    }
    else{
        favourites=[];
    }
    }
    catch(error){
        console.error("Greška. ", error.message);
    }
    
    
}

function setFavourites(){   
    localStorage.setItem(FAVOURITES,  JSON.stringify(favourites));
}

function addToFavourites(idFav, el){     //id destinacije prosleđujemo
   // getFavourites();
    if(favourites.includes(idFav)){
        favourites=favourites.filter(x=>x!=idFav);
    }
    else{
       // let index=favourites.indexOf(idKojiDobijemo)
        favourites.push(idFav);
    }
    setFavourites();
    favInfo();
}


$(document).on("click", ".addToFavourites", function(){
    console.log("klik");
    let idFav=parseInt($(this).data("id"));
     addToFavourites(idFav, this);
     allFilters();
})

$("#showFav").on("click", function(){
    isActive=!isActive;
    if(isActive){
        $(this).text("Prikaži sve ponude");
    }
    else{
        $(this).text("Prikaži omiljeno");
    }
    favInfo();
    allFilters();
})

function favInfo(){
    
    let heartIcon=favourites.length>0 ? `<i class="fa-solid fa-heart fa-lg"></i>` : `<i class="fa-regular fa-heart fa-lg"></i>`;
    $("#heart").html(heartIcon);

    let countFav = (favourites.length > 0 && !isActive) ? `${favourites.length}` : "";
    $("#countFav").html(countFav);

}
function cleanFavourites() {
    if (destinations.length > 0) {
        favourites = favourites.filter(favId => 
            destinations.some(d => d.id === favId)
        );
        setFavourites(); 
        favInfo(); 
    }
}

//paginacija
function pagination(page){
    let start=(page-1)*perPage;
    let end=start+perPage;
    let renderPerPage=getDestination.slice(start, end);

    renderAllOffers(renderPerPage, "#allOffers");
    btnPagination(page);
}

function btnPagination(activePage){
    let totalPage=Math.ceil(getDestination.length/perPage);
    let html="";

    for(let i=1;i<=totalPage;i++){
        html+=`
            <button class="${i===activePage?"activePage":"notActivePage"}" onclick="pagination(${i})">${i}</button>
        `;
    }
    $("#paginationBtn").html(html);
}

//details page
let startImg=0;
let detail;

function showDetails(){
    try{
let html="";
let parametar=new URLSearchParams(window.location.search);
let detailsId=parametar.get("id");
detail=destinations.find(d=>d.id==parseInt(detailsId));

if(detail){
let trandsportDetails=detail.travelInfo.stayIn?"Odsedanje u hotelu":"/";
let mapDates=detail.dates.map(dates=>formatDate(dates)).join(" | ");
html+=`
    <h2 class="mt-4 mb-3 ps-3">${detail.city}, ${detail.country}</h2>
		<div id="imgAndInfo" class="row ps-2">
			<div id="imgSlider" class="col-lg-7 mb-5">
				<img src="${detail.images[startImg].img}" id="slider" alt="${detail.images[startImg].altTag}"/>
				<div id="arrows" class="d-flex justify-content-between">
					<i class="fa-solid fa-angle-left fa-2x arrow d-flex align-items-center justify-content-center" id="previous"></i>
					<i class="fa-solid fa-angle-right fa-2x arrow me-4 d-flex align-items-center justify-content-center" id="next"></i> 
				</div>
				
			</div>
			<div id="imgInfo" class="col-lg-3 align-self-start col-11 ms-3">
            <h4>Informacije o putovanju</h4></br>
				<p>Mesto polaska: ${detail.travelInfo.departure}</p>
				<p>Vreme polaska: ${detail.travelInfo.startTime}</p>
				<p>Vrsta prevoza: ${detail.travelInfo.transport}</p>
				<p>Smeštaj: ${(detail.travelInfo.stayIn ? "Smeštaj u hotelu" : "/")}</p>
                
			</div>
		</div>
		<div id="planAndPayment" class="row mt-5 ps-2  mb-5">
			<div id="travelPlan" class="col-lg-5 col-11 d-flex flex-column">
				<h4>Plan putovanja</h4>
                <p>${detail.travelPlan}</p>
                <h5>Dostupni datumi</h5>
                <div id="dates"><p>${mapDates}</p></div>
			</div>

			<div id="paymentAndDates" class="col-lg-5 col-11 d-flex flex-column">
				<div id="payment">
					<h4>Uslovi plaćanja:</h4>
                    <p>Načini plaćanja: plaćanje gotovinom, karticom (Visa, MasterCard, DinaCard i Maestro kartice), online plaćanje</p>
                    <p>Plaćanje se vrši najkasnije 48 sati pre putovanja. Ukoliko uplata nije izršena u navedenom roku smatra se da je putnik odustao od prijave. Ako je uplata izvršena u krajnjem roku potrebno je poslati dokaz o uplati, kako biste zadržali svoju rezervaciju zbog potencijalnog kašnjenja platnog prometa. Cena putovanja iskazana je u evrima, a plaćanje je u dinarskoj protivvrednosti, po srednjem kursu Narodne Banke Srbije, na dan uplate. </p>
				</div>
				<a href="booking.html?id=${detail.id}" class="btn text-white rounded-pill btn-read-more mt-5 col-lg-3 col-5">Prijavi se</a>
			</div>
		</div>
`;
}
else {
    html+="<h3>Nismo uspeli da pronađemo stranicu.</h3>"
}
$("#detailPage").html(html);
    }
    catch(error){
        console.error("Greška na details stranici:", error.message);
    }

}


$(document).on("click", "#next", function(){
    startImg++;
    if(startImg==detail.images.length){
        startImg=0;
    }
$("#slider").attr("src", detail.images[startImg].img);
$("#slider").attr("alt", detail.images[startImg].altTag);
})

$(document).on("click", "#previous", function(){
    startImg--;
    if(startImg<0){
        startImg=detail.images.length-1;
    }
    $("#slider").attr("src", detail.images[startImg].img);
    $("#slider").attr("alt", detail.images[startImg].altTag);
})

// provera imena i prezimena i slanje povratne informacije
$("#inputName").on("blur", function(){
    checkName($("#inputName"), $("#nameFeedback"));
})

function checkName(input, feedback){
    let regEx=/^[A-ZČĆŠĐŽ][a-zčćšđž]{2,12}(\s[A-ZČĆŠĐŽ][a-zčćšđž]{2,12}){1,3}$/;
    let nameValue=input.val();

    if(regEx.test(nameValue)){
        feedback.html(`<i class="fa-solid fa-circle-check"></i><p>Ispravan unos</p>`).css('color','#0a9905');
        input.removeClass("defaultInput invalid").addClass("valid");
        return true;
    }
    else{
        feedback.html(`<i class="fa-solid fa-circle-xmark"></i> <p>Unos nije validan. Dozvoljen je unos samo slova.</p>`).css('color','#f00')
        input.removeClass("defaultInput valid").addClass("invalid");
        return false;
    }
}
// provera mejla i povratna info
$("#inputMail").on("blur", function(){
    checkMail($("#inputMail"), $("#mailFeeedback"));
})

function checkMail(input, feedback){
    let regEx=/^[\w.-]+@[\w-]+(\.[A-Za-z]{2,}){1,2}$/;
    let mailValue=$("#inputMail").val();

    if(regEx.test(mailValue)){
        feedback.html(`<i class="fa-solid fa-circle-check"></i><p>Ispravan unos</p>`).css('color','#0a9905');
        input.removeClass("defaultInput invalid").addClass("valid");
        return true;
    }
    else{
        feedback.html(`<i class="fa-solid fa-circle-xmark"></i> <p>Unos nije validan.</p>`).css('color', '#f00');
        input.removeClass("defaultInput valid").addClass("invalid");
        return false;
    }
}

//provera poruke. U formi sa kontakta je poruka obavezna i ne može da bude manja od 10 karaktera.
// u drugoj  formi nije obavezna poruka
$("#messageContact").on("blur", function(){
    checkMessage($("#messageContact"), $("#messageFeedbackContact"), true);
})
$("#messageBooking").on("blur", function(){
    checkMessage($("#messageBooking"), $("#messageFeedbackBooking"), false);
})

function checkMessage(textarea, feedback, required){
    let messageValue=textarea.val();

    if(!required){
        return true; //polje nije obavezno, nema nikakve kriterijume pa će uvek vraćati true
    }
    if(required && messageValue.length>=10){
        feedback.html(`<i class="fa-solid fa-circle-check"></i>`).css('color', '#0a9905')
        textarea.removeClass("defaultInput invalid").addClass("valid");
        return true;
    }
    else{
        feedback.html(`<i class="fa-solid fa-circle-xmark"></i> <p>Poruka mora da ima barem 10 karaktera.</p>`).css('color','#f00');
        textarea.removeClass("defaultInput valid").addClass("invalid");
        return false;
    }
}

$("#phone").on("blur", function(){
    checkPhone($("#phone"), $("#phoneFeeedback"));
})

function checkPhone(input, feedback){
    let regEx=/^[\d]{9}$/;
    let phoneValue=input.val();

    if(regEx.test(phoneValue)){
        feedback.html(`<i class="fa-solid fa-circle-check"></i>`).css('color', '#0a9905')
        input.removeClass("defaultInput invalid").addClass("valid");
        return true;
    }
     else{
        feedback.html(`<i class="fa-solid fa-circle-xmark"></i> <p>Nije ispravan format.</p>`).css('color','#f00');
        input.removeClass("defaultInput valid").addClass("invalid");
        return false;
    }
}

function checkRadio(){
    let radioMale=$("#maleRadio");
    let radioFemale=$("#femaleRadio");

    if(radioFemale.is(":checked") || radioMale.is(":checked")){
        return true;
    }
    else{
        $("#radioFeeedback").html(`<i class="fa-solid fa-circle-xmark"></i> <p>Obavezno polje</p>`).css('color','#f00');
        return false;
    }
}

function checkCheckbox(){
    if($("#consent").is(":checked")){
        return true;
    }
    else{
        $("#checkFeeedback").html(`<i class="fa-solid fa-circle-xmark"></i> <p>Obavezno polje</p>`).css('color','#f00');
        return false;
    }
}
// $("#choseDate").on("blur", isSelected);


$("#submitContact").on("click", function(e){
    e.preventDefault();
    let isName= checkName($("#inputName"), $("#nameFeedback"));
    let isMail=checkMail($("#inputMail"), $("#mailFeeedback"));
    let isMessage= checkMessage($("#messageContact"), $("#messageFeedbackContact"), true);

    if(isName && isMail && isMessage){
        $("#formContact")[0].reset();
        $(".feedback").html("");
        $("#inputName").removeClass("valid invalid").addClass("defaultInput");
        $("#inputMail").removeClass("valid invalid").addClass("defaultInput");
        $("#messageContact").removeClass("valid invalid").addClass("defaultInput");
       $("#toastMessage").text("Uspešno ste poslali poruku!").addClass("showToast");

       setTimeout(()=>{
         $("#toastMessage").text("").removeClass("showToast");
       }, 3000)
    }
})

$("#submitBooking").on("click", function(e){
    e.preventDefault();
    let isName= checkName($("#inputName"), $("#nameFeedback"));
    let isMail=checkMail($("#inputMail"), $("#mailFeeedback"));
    let isMessage= checkMessage($("#messageBooking"), $("#messageFeedbackBooking"), false);
    let isPhone=checkPhone($("#phone"), $("#phoneFeeedback"));
    let isCheck=checkCheckbox();
    let isRadio=checkRadio();
    //let isDate=isSelected();

    if(isName && isMail && isMessage && isPhone && isCheck && isRadio){
        $("#bookingForm")[0].reset();
        $(".feedback").html("");
        $("#inputName").removeClass("valid invalid").addClass("defaultInput");
        $("#inputMail").removeClass("valid invalid").addClass("defaultInput");
        $("#messageBooking").removeClass("valid invalid").addClass("defaultInput");
        $("#phone").removeClass("valid invalid").addClass("defaultInput");
         $("#consent").removeClass("valid invalid").addClass("defaultInput");
        $("#radioFeeedback").removeClass("valid invalid").addClass("defaultInput");
        $("#dateFeedback").removeClass("valid invalid").addClass("defaultInput");

         $("#toastMessage").text("Uspešno ste poslali poruku!").addClass("showToast");

       setTimeout(()=>{
         $("#toastMessage").text("").removeClass("showToast");
       }, 3000)
    }
})


function showBookingInfo(){
    try{
    let html="";
    let optionDate="";
    let parametar=new URLSearchParams(window.location.search);
    let bookingId=parametar.get("id");

    let booking=destinations.find(d=>d.id==parseInt(bookingId));
    if(booking){
        let catBooking=categories.find(c=>c.id==booking.categoryId);

        html+=`
        <h3>${booking.city}, ${booking.country}</h3>
        <p class="fs-5 mb-0 mt-2">${catBooking.name}</p>
        <p class="fs-5">Broj dana: ${booking.days==1?`${booking.days} dan`: `${booking.days} dana`}</p>
        <h4>${booking.price} €</h4>
        `;

        booking.dates.forEach(d=>{
            optionDate+=`<option value="${d}">${formatDate(d)}</option>`;
        })

        $("#infoDestination").html(html);
        $("#choseDate").html(optionDate);   
    }
    }
    catch(error){
        console.error("Greška.", error.message);
    }
  
   
}

