import React from 'react'

// this is just a simple container that has some styling to it
// we pass child elements to it

function Container({children}) {
    return (
        <div className='w-full max-w-7xl mx-auto px-4'>
            {children}
        </div>
    )
}

export default Container
