import type { NextPage } from 'next'
import build from 'next/dist/build'
import Head from 'next/head'
import Image from 'next/image'
import React, { useState } from 'react'
import styles from '../styles/Home.module.css'
import { PoeBuild } from './api/build'


const Home: NextPage = () => {
  const poeClasses = [
        {class: "ALL", ascendancy: ["ALL"]},
        {class:"Duelist", ascendancy: ["ALL", "Slayer", "Gladiator", "Champion"]},
        {class:"Shadow", ascendancy: ["ALL", "Assassin", "Saboteur", "Trickster"]},
        {class:"Marauder", ascendancy: ["ALL", "Juggernaut", "Berserker", "Chieftain"]},
        {class:"Witch", ascendancy: ["ALL", "Necromancer", "Occultist", "Elementalist"]},
        {class:"Ranger", ascendancy:  ["ALL", "Deadeye", "Raider", "Pathfinder"]},
        {class:"Templar", ascendancy:  ["ALL", "Inquisitor", "Hierophant", "Guardian"]},
        {class:"Scion", ascendancy: ["ALL", "Ascendant"]},
  ]
  const [currentClass, setCurrentClass] = useState(poeClasses[0]);
  const [currentAscendancy, setCurrentAscendancy] = useState('');
  const [build, setBuild] = useState({} as PoeBuild);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const changeSelectedClass = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const classSelected =  poeClasses[parseInt(event.target.value)];
    setCurrentClass((prev) => classSelected);
    setCurrentAscendancy((prev) => 'ALL');
  }

  const changeSelectAscendancy = (event: React.ChangeEvent<HTMLSelectElement> ) => {
    const ascendancySelected =  currentClass.ascendancy[parseInt(event.target.value)]
    setCurrentAscendancy(() => ascendancySelected)
  }

  const onChooseClick = () => {
    setLoading(true)

    fetch(`/api/build?class_name=${currentClass.class}&ascendancy=${currentAscendancy}`)
    .then(res => res.json())
    .then((data) => {
      if (data && data.class_name) {
        setBuild(() => data)
        setError(() => '')
      } else {
        setBuild(() => ({} as PoeBuild))
        setError(() => "Not found build")
      }
      setLoading(false)
    })
  }

  const buildContent =  
    (error.length > 0)
    ? <p>{error}</p>
    : <>
      <p className=''>{build?.class_name || "Class"}</p>
      <p>{build?.ascendancy || "Ascendancy" }</p>
      <p>{build?.build_name || "Build Name" }</p>
      {build?.build_link && <a target="_blank" rel="noreferrer" className={styles.buildLink} href={build?.build_link}>Link</a>}
    </>

  return (
    <div className={styles.container}>
      <Head>
        <title>Poe - What build next?</title>
        <meta name="description" content="Path of exile, next build selector to play" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          PoE - <strong className="blue">What next build Will I play?</strong>
        </h1>

        <div className={styles.grid}>
          <select className={styles.card} onChange={changeSelectedClass} >
            { poeClasses.map( (poeClass, index) => <option key={poeClass.class} value={index}>{poeClass.class}</option> ) }
          </select>

          <select className={styles.card} onChange={changeSelectAscendancy}>
            { currentClass.ascendancy.map((name, index) => <option key={name} value={index}>{name}</option>) }
          </select>

          <button onClick={onChooseClick} className={styles.cardExpanded + " " + styles.bigText}>Choose for me</button>

          <div className={styles.cardExpanded}>
            { loading 
              ? <div className={styles.loader}>
              <svg className='loader' version="1.1" id="L3" x="0px" y="0px"
                 viewBox="0 0 100 100">
                <circle fill="none" stroke="#fff"  cx="50" cy="50" r="44" />
                  <circle fill="#fff" stroke="#e74c3c"  cx="8" cy="54" r="6" >
                    <animateTransform
                      attributeName="transform"
                      dur="2s"
                      type="rotate"
                      from="0 50 48"
                      to="360 50 52"
                      repeatCount="indefinite" />
                  </circle>
                </svg>
                Loading...
              </div>
              : buildContent
            }
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/riojano0/poe-what-build-next"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.logo}>
            <Image src="https://icongr.am/devicon/github-original.svg?size=128&color=currentColor&w=96&q=75" alt="GitHub Logo" width={72} height={26} />
          </span>
        </a>
        <p>Current season version 3.19</p>
      </footer>
    </div>
  )
}

export default Home
