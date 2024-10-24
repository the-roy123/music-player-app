console.log("lets write javascript")
let currentsong = new Audio()
let songs
let currFolder
function convertSecondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    // Pad minutes and seconds with leading zeros if they are less than 10
    const formattedMinutes = Math.round(minutes < 10 ? '0' + minutes : minutes);
    const formattedSeconds = Math.round(remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds);
    
    return `${formattedMinutes}:${formattedSeconds}`;
}

// Example usage:
const timeInSeconds = 12;
const formattedTime = convertSecondsToMinutes(timeInSeconds);
 // Output: "00:12"


async function getSongs(folder) {
    currFolder=folder
    let a = await fetch(`http://192.168.29.42:3000/${folder}/`)
    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }
    let ul = document.querySelector(".songlists").getElementsByTagName("ul")[0]
    ul.innerHTML=""
    for (const song of songs) {
        ul.innerHTML = ul.innerHTML + `                   <li>
                            <img src="music.svg" class="invert" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Roy</div>
                                </div>
                                <div class="playnow">
                                    <span >Play now</span>
                                    <img src="play.svg" class="invert" style="width: 24px;" alt="">
                                </div>
                            </div>
                        </li>`

    }//displaying the songs in the list
    Array.from(document.querySelector(".songlists").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", element => {
            
            playmusic(e.querySelector(".info").firstElementChild.innerHTML)

        })
    })// adding listeners to each song
    return songs

}//getting all the song names
const playmusic = (track,pause=false) => {
    currentsong.src = (`/${currFolder}/` + track)
    if(!pause)
    {
        currentsong.play()
        play.src = "pause.svg"

    }


    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}//playing the selected song
async function diplayAlbums()
{
    let a = await fetch(`http://192.168.29.42:3000/songs/`)
    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response
    console.log(div)
    let anchors=div.getElementsByTagName("a")
    let cardContainer=document.querySelector(".cardContainer")
    let arr=Array.from(anchors)
    for (let index = 0; index < arr.length; index++) {
        const e = arr[index];
        
        if(e.href.includes("/songs"))
            {
                let folder=(e.href.split("/").slice(-2)[0])
                let a = await fetch(`http://192.168.29.42:3000/songs/${folder}/info.json`)
                let response = await a.json()
                cardContainer.innerHTML=cardContainer.innerHTML+`<div class="card " data-folder="${folder}">
                            <div class="playbtn">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="play">
                                    <circle />
                                    <path
                                        d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                                        fill="black" />
                                </svg>
    
    
                            </div>
                            <img src="/songs/${folder}/coverr.jpg" alt="">
                            <h5>${response.title}</h5>
                            <p style="font-size: smaller;">${response.description}</p>
                        </div>`
    
            }
        
    }
    
     //adding listeners to card
    Array.from(document.getElementsByClassName("card")).forEach(e=>
        {
            e.addEventListener("click",async item=>
            {
                songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
                playmusic(songs[0])
            }
            )
        }
        )

}




async function main() {
    await getSongs("songs/cs")
    playmusic(songs[0],true)
    //displaying albums on the page

     diplayAlbums()

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
//play/pause images
        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })
    //listen for time updateevent
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(currentsong.currentTime)}/${convertSecondsToMinutes(currentsong.duration)}`
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%"

    })
    //adding a seekbar
    document.querySelector(".seekbar").addEventListener("click",(e)=>
    {
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left=percent+"%"
        currentsong.currentTime=((currentsong.duration)*percent)/100
    })
    //adding eventlistener to hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>
    {
        document.querySelector(".left").style.left=0+"%"
    })
    //adding close button
    document.querySelector(".close").addEventListener("click",()=>
    {
        document.querySelector(".left").style.left=-120+"%"
    })
    //adding previous and next buttons
    next.addEventListener("click",()=>
    {
        currentsong.pause()
        let index=songs.indexOf(currentsong.src.split("/").slice(-1) [0])
        if((index+1)<songs.length)
        playmusic(songs[index+1])
        else
        playmusic(songs[0])
    })
    previous.addEventListener("click",()=>
    {
        currentsong.pause()
        let index=songs.indexOf(currentsong.src.split("/").slice(-1) [0])
        if((index-1)>=0)
        playmusic(songs[index-1])
        else
        playmusic(songs[songs.length-1])

    })
    //adding volume button
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>
    {
        
        currentsong.volume=parseInt(e.target.value)/100
    })
    //mute button
    document.querySelector(".volumebuttons>img").addEventListener("click",e=>
    {
        if(e.target.src.includes("volumehigh.svg"))
        {
            e.target.src=e.target.src.replace("volumehigh.svg","mute.svg")
            currentsong.volume=0
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
        }
        else{
            e.target.src=e.target.src.replace("mute.svg","volumehigh.svg")
            currentsong.volume=0.1
            document.querySelector(".range").getElementsByTagName("input")[0].value=10
        }
    }
    )

}

main()
