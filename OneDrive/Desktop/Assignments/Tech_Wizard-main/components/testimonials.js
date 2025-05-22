import Image from 'next/image'
import React from 'react'
import Container from './container'

import userOneImg from '../public/img/user1.jpg'
import userTwoImg from '../public/img/user2.jpg'
import userThreeImg from '../public/img/user3.jpg'

const Testimonials = () => {
    return (
        <Container>
            <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-3">
                <div className="lg:col-span-2 xl:col-auto">
                    <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14">
                        <p className="text-2xl leading-normal ">
                            Share a real <Mark>testimonial</Mark>
                            that hits some of your benefits from one of your
                            popular customer.
                        </p>

                        <Avatar
                            image={userOneImg}
                            name="Sri Devi Naidu"
                            title="VP Sales at SkinQ"
                        />
                    </div>
                </div>
                <div className="">
                    <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14">
                        <p className="text-2xl leading-normal ">
                            Make sure you only pick the{' '}
                            <Mark>right sentence</Mark>
                            to keep it short and simple.
                        </p>

                        <Avatar
                            image={userTwoImg}
                            name="Vishnu Saxena"
                            title="Lead marketer at NewMe"
                        />
                    </div>
                </div>
                <div className="">
                    <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14">
                        <p className="text-2xl leading-normal ">
                            This is an <Mark>awesome</Mark> for physical stores
                            I&apos;ve seen. I would use this for anything.
                        </p>

                        <Avatar
                            image={userThreeImg}
                            name="Deepak Ahuja"
                            title="Co-founder of FabAlley"
                        />
                    </div>
                </div>
            </div>
        </Container>
    )
}

function Avatar(props) {
    return (
        <div className="flex items-center mt-8 space-x-3">
            <div className="flex-shrink-0 overflow-hidden rounded-full w-14 h-14">
                <Image
                    src={props.image}
                    width="40"
                    height="40"
                    alt="Avatar"
                    placeholder="blur"
                />
            </div>
            <div>
                <div className="text-lg font-medium">{props.name}</div>
                <div className="text-gray-600">{props.title}</div>
            </div>
        </div>
    )
}

function Mark(props) {
    return (
        <>
            {' '}
            <mark className="text-indigo-800 bg-indigo-100 rounded-md ring-indigo-100 ring-4">
                {props.children}
            </mark>{' '}
        </>
    )
}

export default Testimonials
