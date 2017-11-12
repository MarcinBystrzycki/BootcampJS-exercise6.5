import React from 'react';
import styles from './MessageList.css';

const Message = props => (
	<div className={styles.Message}>
		<img className={styles.UserImage} src={props.image} alt='#' />
		<strong>{props.from}: </strong>
		<span>{props.text}</span>
	</div>
);

const MessageList = props => (
	<div className={styles.MessageList}>
		{
			props.messages.map((message) => {
				return (
					<Message
						key={message.id}
						image={message.image}
						from={message.from}
						text={message.text}
					/>
				);
			})
		}
	</div>
);

export default MessageList;