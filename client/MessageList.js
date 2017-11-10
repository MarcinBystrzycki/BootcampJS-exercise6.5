import React from 'react';
import styles from './MessageList.css';

const Message = props => (
	<div className={styles.Message}>
		<img src={props.image} alt='#' />
		<strong>{props.from}: </strong>
		<span>{props.text}</span>
	</div>
);

const MessageList = props => (
	<div className={styles.MessageList}>
		{
			props.messages.map((message, i) => {
				return (
					<div>
						<Message
							key={i}
							image={message.image}
							from={message.from}
							text={message.text}
						/>
					</div>
				);
			})
		}
	</div>
);

export default MessageList;