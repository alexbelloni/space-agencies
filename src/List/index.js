import React from 'react';
import {
    Container,
    Agency,
} from './style';

const List = ({ agencies, onDelete, onSelect }) => {
    //const MAX_NAME_LENGTH = 40;
    return (
        <Container>
            <h2>List of {agencies.length} agencies</h2>
            {agencies.sort(function (a, b) {
                if (a.name > b.name) return 1;
                if (a.name < b.name) return -1;
                return 0;
            }).map((a, i) => {
                return (
                    <Agency key={i} onClick={() => onSelect(a)} style={{color: process.env.NODE_ENV !== 'development' ? '#fff' : (a.url ? '#fff' : 'red')}}>
                        {/* <span>{a.name.length > MAX_NAME_LENGTH ? `${a.name.substr(0, MAX_NAME_LENGTH)}...` : a.name}</span> */}
                        <span>{a.name}</span>
                        <span>{a.acronym} - {a.country}</span>
                        {a.url && <a href={a.url} target="blank">website</a>}
                        {process.env.NODE_ENV === 'development' && <button onClick={() => onDelete(a.id)}>delete</button> }
                        <hr style={{ color: "white", heigth: "1px", width: "100%" }} />
                    </Agency>
                )
            })}
        </Container>
    )
}


export default List;