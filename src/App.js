import './App.css';
import './bg.css'
import {useEffect, useState} from 'react'
import $ from 'jquery'
import { Meta } from './Meta';
import { GetColorName } from 'hex-color-to-color-name';

 


function App() {

  var sheet = document.styleSheets[1]
  const [file, setFile] = useState(null)
  const localHost = 'http://127.0.0.1:5000/'
  const formData = new FormData()
  const [DURL, setDURL] = useState('')
  const [b64Code, setB64] = useState('')
  const [commons, setCommons] = useState([])
  const [loading, setLoading] = useState(false)
  const [btn, setBtn] = useState(null)
  const [colors, setColors] = useState(false)
  const [currentBg, setCurrentBg] = useState("white")
  const [nextBg, setNextBg] = useState("white")
  const styleBg = {backgroundColor:currentBg}
  const [clientH, setClientH] = useState(0)
  const [firstCommon, setFirst]= useState('')
  const [bgSetting, setBgSetting] = useState(null)
  const [allColors, setAllColors] = useState([])
  const [allColorsQuery, setACQ] = useState(false)
  const [loaded, setLoaded] = useState(0)

  const [size, setSize] = useState(null)
  const [cssObj, setCss] = useState({})
  const [cssLst, setCssLst] = useState([])

  const [askedMeta, setAskedMeta] = useState(false)

  window.addEventListener("scroll", function(){

    
    var scrollMaxY = window.scrollMaxY || (document.documentElement.scrollHeight - document.documentElement.clientHeight)

    let adding = this.scrollY/scrollMaxY
    this.document.getElementById("bg").style.opacity = adding

    if (this.document.getElementById("bg").style.opacity > 0.8) { 
      this.document.getElementById("bg").style.opacity = 0.8

    }



  })


  let element = document.createElement("style")
    element.setAttribute("id", 'bgchanger')
    element.innerHTML = `
    
    @keyframes bg_change {

      from{
          background-color: ${currentBg};
      } to { 
          background-color: ${nextBg};
      }
      
  }
  
  .bg-change { 
      animation: bg_change 0.2s ease-in;
      animation-fill-mode: forwards;
  }
  
  .bg-temp { 
    background: ${currentBg}
  }`
    document.querySelector("html").appendChild(element)


  

  if (loading == true) { 
    window.onscroll = () => { window.scroll(0, 0); };
  }  else {
    window.onscroll = () => { window.scroll()}
  }

  useEffect(() => { 
  
    setBtn(document.getElementById("selectBtn"))
  }, [])

  useEffect(() => {

    if (colors) { 
      var section = document.getElementById("colorbox")

      $("html, body").animate({
           scrollTop: $(section).offset().top
       });
    
    }

  }, [colors])

  useEffect(() => { 
    if (b64Code != '')
    sendFile()

    }, [b64Code])

  function changeImage(element) { 
    setFile(element)
    setSize(element.size)

    convertB64(element)
  }

  function copyColor(color) { 

    navigator.clipboard.writeText(color.toString())

    let doc = document.getElementById(`${color}-id`)
    doc.innerText = 'Copied!'

    setTimeout(function(){ 
      doc.innerText = color
    },2000)

  }

  async function convertB64(element) { 
    let reader = new FileReader();
    reader.readAsDataURL(element);
    reader.onload = function(e) { 

      var image = new Image();
      image.src = e.target.result;

      image.onload = function () {
        var height = this.height;
        var width = this.width; 
        setSize([width, height])
        
      
      }
  
    


      let text = e.target.result
      let text_format = text.split(",")[1]
      setB64(text_format)


    }





  }

  function showAllColors() { 
    setACQ(true)
    setLoading(true)


    setTimeout(function(e){ 
      let divs = document.querySelectorAll(".count")
      if (divs.length < allColors.length){
        console.log("caca")
      } else{ 
        setLoading(false)
      }
    }, 10)
  }





  function addLoaded() { 
let num = loaded + 1
setLoaded(num) 
if (loaded == allColors.length()) { 
  console.log("gone")
}
 }


  

  function clickSelect() { 
    btn.click()
  }

  function restartBg(){ 


    let element = document.querySelectorAll("#bgchanger")

    element.forEach((e) => { 
      e.remove()
    })

    let nextelement = document.createElement("style")
    nextelement.setAttribute("id", 'bgchanger')

    nextelement.innerHTML = `
  
    @keyframes bg_change {

      from{
          background-color: ${currentBg};
      } to { 
          background-color: ${nextBg};
      }
      
  }
  
  .bg-change { 
      
      animation: bg_change 0.3s ease-in;
      animation-fill-mode: forwards;
  }
  
  .bg-temp { 
    background-color: ${currentBg}
  }
  `
    
    $('.circles li').each(function(){
      $(this).removeClass("bg-change")
    })
    
    setTimeout(function(){
      $('.circles li').each(function(){
        $(this).addClass("bg-change")})

    }, 100)

 

  }


 

  function sendFile() { 
      setLoading(true)




      let jsonFile = JSON.stringify(b64Code)

      fetch(`https://colors-api-flask.herokuapp.com/img`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonFile
      }).then(resp => resp.json())
        .then(data => {
          let text = JSON.stringify(data)
          let parsed = JSON.parse(text)
          setAllColors(parsed)

          setCommons(parsed.slice(0, 6))

        }).then(() => { 
          setLoading(false)
          setColors(true)
          setClientH(document.body.clientHeight)

          setBgSetting(`linear-gradient(to top, ${commons[0]}, #4e54c836);`)}

        )

      

  }


  useEffect(() => { 
        commons.forEach((c) => { 
        var colorName = GetColorName(c)
        var colorChanges = colorName.replace(" ", '-')
        var colorNameFinal = `--${colorChanges}`
        var fullName = `${colorNameFinal}: ${c}`
        var fullNameFormated = fullName.replace('"', '')
  
        setCssLst((prev) => [...prev, fullNameFormated])
        console.log(cssLst)
  
      })
    
    
  }, [bgSetting])




   

function showDialog() { 

  let div = document.querySelector('.dialog-colors')

  cssLst.map((clr) => { 
    let el = document.createElement("p")
    el.innerHTML = clr
    div.appendChild(el)
  })


  div.classList.remove("hidden")
}

  return (

    

    <div className="App">
      {loading && <div className='loading'>

        <div className='loader'></div>
        </div>}

        {bgSetting && <div className='bg' id='bg' style={{background:`linear-gradient(to top, ${commons[0]}, ${commons[1]}, ${commons[2]})`, opacity:'0'}}></div>
}

            <div className="area">
            <ul className="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
            </ul>
    </div >

 
      
      
      <div className='ui-title'><h1 className='title'>Commonify.com</h1>
      <p>a webapp to get the most common colors out of a picture. And the other colors too.</p>
      <p>(so, yeah, pretty much all the colors)</p>

      <button onClick={() => clickSelect()} className='select-btn red'>Select a picture</button>

    
      <input id='selectBtn' hidden onChange={(e) => {
        
        changeImage(e.target.files[0])}} type='file'></input>
</div>


<div className=''>


</div>
      



      {colors &&
      <div id='colorbox' className='color-box'>

        <p className='title-colors'>The most commons colors are:</p>
      <div href='#colors' className='colors'>
          {commons.map((color) => {
              let name = GetColorName(color)
              return ( 
                <div>
                   <div onClick={() => copyColor(color)}className='color' onMouseOver={() => {
                  setCurrentBg(nextBg)
                  setNextBg(color)
                  restartBg()
                }
                  } style={{backgroundColor:`${color}`}}>
                  
                </div>
                <p id={`${color}-id`}>{color}</p>

                    <p>{name}</p>

                  </div>

                  

               
              )
            })}




      </div>
      <div className='dialog-colors hidden'> 
      <p>Css formated common colors: </p>

  
      </div>    



      </div>
      
      }


{colors && 

<div className='options'>
      <p onClick={() => showAllColors()} className='show-all' style={{color:'black'}}>Load all colors</p>
      <p onClick={() => showDialog()} className='show-all' style={{color:'black'}}>Show css</p>

      </div>}

      
 

     


      {allColorsQuery &&

<div className='block'>

<ul className='colors-all'>
      {allColors.map((color) => {
            return ( 
                 <li id={`${color}-id-div`} onLoad={() => console.log("loaded")} onClick={() => copyColor(color)} className='color small' style={{backgroundColor:color}}>
                  
                <p className='count' id={`${color}-id`}>{color}</p>

                </li>
                

                

             
            )
          })}
      </ul>
</div>}
     
       

      

      
    
     

      




    </div>
  );
}

export default App;
