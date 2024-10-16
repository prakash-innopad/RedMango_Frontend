import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { setSearchItem } from '../../../Storage/Redux/MenuItemSlice';

function Banner() {
    const [value, setValue] = useState("");
    const dispatch = useDispatch();
    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) =>{
        dispatch(setSearchItem(e.target.value));
        setValue(e.target.value);
    }
  return (
    <div className='custom-banner' style={{width:"100%"}}>
        <div className='m-auto d-flex align-items-center'style={{  width: "400px",height: "15vh", }}>
            <input className='form-control rounded-pill'
            style={{}} value = {value}  onChange={handleChange} placeholder='Serach for Delicious food itmes!'>
            </input>
                <span style={{position :"relative", left:"-43px"}}><i className="bi bi-search"></i></span>
        </div>
    </div>
  )
}

export default Banner