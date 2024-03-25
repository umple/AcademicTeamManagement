import React from 'react'
import styled from 'styled-components'

// Footer styled component
const FooterContainer = styled.footer`
  background-color: #2c3e50;
  color: #ecf0f1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  font-family: 'Helvetica', 'Arial', sans-serif;
  white-space: nowrap;
  overflow-x: auto;
`

function Footer () {
  return (
    <FooterContainer>
      © {2023} Academic Team Management.
      This project is open source. For contributions, visit our
      <a href='https://github.com/umple/AcademicTeamManagement/wiki' style={{ color: '#3498db', textDecoration: 'none', marginLeft: '5px' }}>
        GitHub repository
      </a>.
    </FooterContainer>
  )
}

export default Footer
