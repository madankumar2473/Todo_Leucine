import React from 'react'
import Container from './container'

const SectionTitle = (props) => {
    return (
        <Container
            className={`flex w-full flex-col mt-4 ${
                props.align === 'left'
                    ? ''
                    : 'items-center justify-center text-center'
            }`}
        >
            {props.pretitle && (
                <div className="text-base font-bold tracking-wider gradient-text uppercase">
                    {props.pretitle}
                </div>
            )}

            {props.title && (
                <h2 className="max-w-2xl mt-3 text-3xl font-bold leading-snug tracking-tight text-black lg:leading-tight lg:text-4xl">
                    {props.title}
                </h2>
            )}

            {props.children && (
                <div className="max-w-2xl py-4 text-lg leading-normal text-neutral-700 lg:text-xl xl:text-xl">
                    {props.children}
                </div>
            )}
        </Container>
    )
}

export default SectionTitle
