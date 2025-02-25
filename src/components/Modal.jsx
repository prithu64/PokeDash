
import ReactDom from 'react-dom'

export default function Modal({children,handleCloseModal}){
    return ReactDom.createPortal(
       <div className='modal-container'>
          <button className='modal-underlay' onClick={handleCloseModal}/>
          <div className='modal-content'>
            {children}
          </div>
       </div>,
       document.getElementById('portal')
    )
}