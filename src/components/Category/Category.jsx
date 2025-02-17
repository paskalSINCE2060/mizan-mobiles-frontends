import React from 'react'
import smartphone from '../../assets/iphone14.jpg'
import watch from '../../assets/GalaxyWatch7.jpeg'
import laptop from '../../assets/iphone13promax.png'
import './Category.css';

const Category = () => {
  return (
    <>

    <main>
        <section className="categories">
            <div className="category">
                <img src={smartphone} alt="Smartphones"/>
                <h2>Smartphones</h2>
            </div>
            <div className="category">
                <img src={watch} alt="Accessories"/>
                <h2>Accessories</h2>
            </div>
            <div className="category">
                <img src={laptop} alt="Tablets"/>
                <h2>Tablets</h2>
            </div>
            <div className="category">
                <img src={laptop} alt="Earphones"/>
                <h2>Earphones</h2>
            </div>
        </section>
    </main>
    </>
  )
}

export default Category
