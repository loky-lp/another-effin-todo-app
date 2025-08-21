import { SVGProps } from 'react'

export function Logo(props: SVGProps<SVGSVGElement>) {
	return (
		<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<defs>
				<radialGradient
					id="paint0_radial_8_9" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
					gradientTransform="translate(30 30) rotate(-135) scale(42.4264)"
				>
					<stop stopColor="#F89B29" />
					<stop offset="0.504808" stopColor="#FF3E00" />
					<stop offset="1" stopColor="#FF0F7B" />
				</radialGradient>
			</defs>

			<rect width="30" height="30" rx="6" fill="url(#paint0_radial_8_9)" />
			<path d="M6 20L8 22L12 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M6 10L8 12L12 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M16 9H24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M16 15H24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M16 21H24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

export default Logo
