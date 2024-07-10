/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Typography } from '@mui/material';
import { useState, useEffect } from 'react';

import { CourseCard } from '../../components/CourseCard';

function CoursesList() {
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		fetch(`${import.meta.env.VITE_BACKEND_API}/api/v1/admin/courses`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				setCourses(data.courses);
			});
	}, []);

	return (
		<div
			style={{
				margin: '2rem 3rem',
			}}
		>
			<Typography variant="h3" color={'white'}>
				Courses List :-
			</Typography>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: '1.5rem',
					marginTop: '2rem',
				}}
			>
				{courses.map((course, index) => (
					<CourseCard
						key={index}
						course={course}
					/>
				))}
			</div>
		</div>
	);
}

export default CoursesList;
