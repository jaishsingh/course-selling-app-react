/*eslint-disable*/
import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AppBar() {
	const [username, setUsername] = React.useState(null);

	useEffect(() => {
		fetch(`${import.meta.env.VITE_BACKEND_API}/api/v1/admin/me`, {
			method: 'GET',
			headers: {
				// 'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		}).then((res) => {
			res.json().then((data) => {
				setUsername(data.username.split('@')[0]);
			});
		});
	}, []);

	if (username) {
		return <SignedInUserAppbar />;
	}

	return <GuestUserAppbar />;
}

function Heading() {
	return (
		<Typography variant="h4" color={'black'}>
			Coursera Learning Platform
		</Typography>
	);
}

function SignedInUserAppbar() {
	const navigate = useNavigate();
	return (
		<div
			className="appbar-container"
			style={{
				display: 'flex',
				flexFlow: 'row nowrap',
				justifyContent: 'space-between',
				padding: '15px',
				borderBottom: '4px solid red',
				backgroundColor: '#FFB500 ',
			}}
		>
			<Heading />
			<div className="appbar-buttons">
				<Button
					variant="contained"
					color="primary"
					style={{ margin: '0 20px' }}
					onClick={() => {
						navigate('/courses');
						// window.location.href = '/courses';
					}}
				>
					Courses
				</Button>
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						localStorage.removeItem('token');
						// navigate('/login');
						window.location.href = '/login';
					}}
				>
					Log Out
				</Button>
			</div>
		</div>
	);
}

function GuestUserAppbar() {
	const navigate = useNavigate();
	return (
		<div
			style={{
				display: 'flex',
				flexFlow: 'row nowrap',
				justifyContent: 'space-between',
				padding: '15px',
				borderBottom: '4px solid red',
				backgroundColor: '#FFB500 ',
			}}
		>
			<Heading />
			<div className="appbar-buttons">
				<Button
					variant="contained"
					color="primary"
					style={{ margin: '0 20px' }}
					onClick={() => {
						navigate('/login');
						// window.location.href = '/login';
					}}
				>
					Log In
				</Button>
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						navigate('/register');
						// window.location.href = '/register';
					}}
				>
					Register
				</Button>
			</div>
		</div>
	);
}

export default AppBar;
