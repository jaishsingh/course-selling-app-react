/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function CourseCard(props) {
	const navigate = useNavigate();
	return (
		<div
			className="course-card"
			style={{
				height: 'auto',
				padding: '.75rem',
				borderRadius: '.5rem',
				boxShadow: '0 0 10px #ddd',
				backgroundColor: '#f5f5f5',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				gap: '1rem',
			}}
			onClick={() => navigate(`/course/${props.course._id}`)}
		>
			<div className="first-block">
				<img
					src={props.course.thumbnailUrl}
					style={{ width: '100%' }}
				/>
				<Typography variant="h5">{props.course.title}</Typography>
				<Typography variant="subtitle2">
					{props.course.description}
				</Typography>
			</div>

			<div className="second-block">
				<hr />
				<br />
				<Typography>Price : ₹ {props.course.price}</Typography>
				<Typography>
					First Published On : {props.course.createdAt.split('T')[0]}
				</Typography>
				<Typography>
					Last Updated On : {props.course.updatedAt.split('T')[0]}
				</Typography>
			</div>
		</div>
	);
}

export { CourseCard };
