import { Typography } from '@mui/material';

function Hero() {
	return (
		<div className="hero">
			<div className="hero__content">
				<br />
                <Typography
					variant="h3"
					style={{
						color: '#fff',
					}}
					className="hero__title"
				>
					Welcome to our Coursera, the best online courses platform
				</Typography>
                <br />
                <hr />
                <br />
				<Typography
					variant="h6"
					style={{ color: '#fff' }}
					className="hero__description"
				>
					We have the best products for you. Check them out!
				</Typography>
			</div>
		</div>
	);
}

export default Hero;
