import Image from 'next/image'
import React from 'react'
import Container from './container'

const Benefits = (props) => {
    const { data } = props
    return (
        <>
            <Container className="flex flex-wrap mb-15 lg:gap-10 lg:flex-nowrap ">
                <div
                    className={`flex items-center justify-center w-full lg:w-1/2 ${
                        props.imgPos === 'right' ? 'lg:order-1' : ''
                    }`}
                >
                    <div>
                        <Image
                            src={data.image}
                            width="800"
                            height="auto"
                            alt={data.imageAltText}
                            className={'object-cover'}
                            placeholder="blur"
                            blurDataURL={data.image.src}
                        />
                    </div>
                </div>

                <div
                    className={`flex flex-wrap items-center w-full lg:w-1/2 ${
                        data.imgPos === 'right' ? 'lg:justify-end' : ''
                    }`}
                >
                    <div>
                        <div className="flex flex-col w-full mt-6">
                            <h3 className="max-w-2xl mt-3 text-3xl text-center sm:text-left font-bold leading-snug tracking-tight text-gray-800 lg:leading-tight lg:text-4xl">
                                {data.title}
                            </h3>

                            {/* <p className="max-w-2xl py-4 text-lg leading-normal text-gray-500 lg:text-xl xl:text-xl">
                {data.desc}
              </p> */}
                        </div>

                        <div className="w-full mt-5">
                            {data.bullets.map((item, index) => (
                                <Benefit
                                    key={index}
                                    title={item.title}
                                    icon={item.icon}
                                >
                                    {item.desc}
                                </Benefit>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </>
    )
}

function Benefit(props) {
    return (
        <>
            <div className="flex items-start mt-8 space-x-3">
                <div className="flex items-center justify-center flex-shrink-0 mt-1  w-10 h-10 ">
                    {React.cloneElement(props.icon, {
                        className:
                            'w-10 h-10 gradient-bg text-white rounded-md',
                    })}
                </div>
                <div>
                    <h4 className="text-xl font-medium text-gray-800">
                        {props.title}
                    </h4>
                    <p className="mt-1 text-neutral-700">{props.children}</p>
                </div>
            </div>
        </>
    )
}

export default Benefits
