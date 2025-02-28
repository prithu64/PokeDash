import { useEffect, useState } from "react"
import { first151Pokemon, getFullPokedexNumber, getPokedexNumber } from "../utils";
import  TypeCard  from "./TypeCard";
import Modal from "./Modal";

export default function PokeCard({selectedPokemon}){
    
    const [data,setData] = useState(null);
    const [loading,setLoading]= useState(false);
    const [skill,setSkill] = useState(null);
    const [loadingSkill,setLoadingSkill] = useState(false)

    const {name,heigth,abilities,stats,types,moves,sprites} = data || {}

    const imgList = Object.keys(sprites || {}).filter(key=>{
        if(!sprites[key]){return false}
        if(['versions','other'].includes(key)){return false}
         return true
    })

    async function fetchMoveData(move,moveUrl){
       if(loadingSkill || !localStorage || !moveUrl){return}

       //check cache for move
       let cache = {}
       if(localStorage.getItem('pokemon-moves')){
          cache = JSON.parse(localStorage.getItem('pokemon-moves'))
       }

       if(move in cache){
        setSkill(cache[move])
        console.log("found move in cache")
       }

       try {
        setLoadingSkill(true)
        const res = await fetch(moveUrl);
        const moveData = await res.json();
        console.log('Fetched move from API',moveData)
        const description = moveData?.flavor_text_entries.filter(
         val=>{
            return val.version_group.name ='firered-leafgree'
         }
        )[0]?.flavor_text;

        const skillData = {
            name : move,
            description
        }
        setSkill(skillData)
        cache[move] = skillData
        localStorage.setItem('pokemon-moves',JSON.stringify(cache))
       } catch (error) {
        console.log("error :",error)
       }finally{
           setLoadingSkill(false)
       }

    }

    useEffect(()=>{
         //if loading ,exit logic
         if(loading || !localStorage){return}
         //check if the selectred pokemon information is available in cache
         //1.define the cache
         let cache = {}
         if(localStorage.getItem('PokeDash')){
            cache = JSON.parse(localStorage.getItem('PokeDash'));
         }
         //2.check if the selected pokemon is in the cache
         if(selectedPokemon in cache){
           setData(cache[selectedPokemon])
           console.log("found pokemon data in cache")
           return
         }
        
         //we passed all the cache stuff to no avail and now need to fetch the data from the api
         async function fetchPokemonData() {
            setLoading(true)
            try {
                const baseUrl = 'https://pokeapi.co/api/v2/'
            const suffix = 'pokemon/'+ getPokedexNumber(selectedPokemon)
                const finalUrl = baseUrl + suffix
                const res = await fetch(finalUrl)
                const pokemonData = await res.json()
                setData[pokemonData]
                console.log(pokemonData)
                //cache the fetched info
                cache[selectedPokemon] = pokemonData;
                localStorage.setItem('PokeDash',JSON.stringify(cache))
            } catch (error) {
             console.log("error : ",error)
            }finally{
              setLoading(false)
            }
         }
         
         fetchPokemonData();

         //3. if we fetch from the api make sure to save the info to the cache for future use
    },[selectedPokemon])

    if(loading || !data
    ){
        return (
            <div>
                <h4>Loading...</h4>
            </div>
        )
    }

    return (
        <div className="poke-card">
            {skill && (<Modal handleCloseModal={()=>{
               setSkill(null)
            }}> 
                <div>
                    <h2>{skill.name.replaceAll('-',' ')}</h2>
                </div>
                <div>
                    <h6>Description</h6>
                    <p>{skill.description}</p>
                </div>
            </Modal>)}
            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{first151Pokemon[selectedPokemon]}</h2>
            </div>
            <div className="type-container">
              {types.map((typeObj,typeIndex)=>{
                return (
                    <TypeCard key={typeIndex} type={typeObj?.type?.name} />
                )
              })}
            </div>
            <img className="default-img" src={'/pokemon/'+getFullPokedexNumber(selectedPokemon)+'.png'} alt="/"/>
            <div className="img-container">
                {imgList.map((spriteUrl,spriteIndex)=>{
                    const imgUrl = sprites[spriteUrl]
                   return (
                    <img key={spriteIndex} src={imgUrl} alt={`${name}-img-${spriteUrl}`}/>
                   )
                })}
            </div>
            <h3>Stats</h3>
            <div className="stats-card">
                {stats.map((statObj,statIndex)=>{
                  const {stat,base_stat} = statObj
                  return (
                    <div key={statIndex} className="stat-item">
                       <p>{stat?.name.replaceAll('-','')}</p>
                       <h4>{base_stat}</h4>
                    </div>
                  )
                })}
            </div>
            <h3>Moves</h3>
            <div className="pokemon-move-grid">
                {moves.map((moveObj,moveIndex)=>{
                 return (
                    <button key={moveIndex} className="pokemon-move" onClick={()=>{
                        fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)
                    }}>
                        <p>{moveObj?.move?.name.replaceAll('-',' ')}</p>
                    </button>
                 )
                })}
            </div>
        </div>
    )
}