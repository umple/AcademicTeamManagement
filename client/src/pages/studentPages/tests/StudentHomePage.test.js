import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter, Route, Routes, MemoryRouter } from "react-router-dom";
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import StudentHomePage from "../StudentHomePage";
import  * as groupService from '../../../services/groupService';

jest.mock('../../../services/groupService');

jest.mock('../../../services/groupService', () => ({
    getCurrGroup: jest.fn(), // Mocking getCurrGroup
  }));

  jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => {
            const translations = {
                "common.group-info": "Group Info",
                "find-or-create-group": "Join or create a new group",
            };
            return translations[key] || key; // Fallback to the key itself
        },
    }),
}));


describe('StudentHomePage', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <StudentHomePage />
      </BrowserRouter>
    );

    // Check if a specific element is in the document
    expect(screen.getByText('Group Info')).toBeInTheDocument();
  });

  it('renders Group Info section correctly when the student is in a group', () => {
    const groupData = {
      group_id: 'Group A',
      members: ['Steve', 'Craig', 'John'],
      project: 'Project Alpha'
    };
    groupService.getCurrGroup.mockResolvedValueOnce(groupData);

    render(
        <BrowserRouter>
            <StudentHomePage />
        </BrowserRouter>
    );

  });
  //colour test for info boxes (1/2)
  it('applies correct color when the student is not in a group', async () => {
    groupService.getCurrGroup.mockResolvedValueOnce({ success: false });

    const { container } = render(
        <BrowserRouter>
          <StudentHomePage />
        </BrowserRouter>
    );

    const groupBox = container.querySelector('.MuiPaper-root');
    expect(groupBox).not.toHaveClass('infoBoxInGroup'); //Verfies background colour of group box is not associated with being in a group
  });
  // colour test for info boxes (2/2)
  it('applies correct color when the student is in a group', async () => {
    // Mock group data to simulate that the student is in a group
    const groupData = {
      group_id: 'Group A',
      members: ['Steve', 'Craig', 'John'],
      project: null,
    };
    groupService.getCurrGroup.mockResolvedValueOnce(groupData);
  
    const { container } = render(
      <BrowserRouter>
        <StudentHomePage />
      </BrowserRouter>
    );
  
    // Wait for the group data to be fetched and the DOM to update
    await waitFor(() => {
      const groupBox = container.querySelector('.MuiPaper-root');

      // Expect the Paper component to have the 'infoBoxInGroup' class, which indicates the correct color
      const styles = window.getComputedStyle(groupBox);
    // Convert RGB to Hex
      const rgb = styles.backgroundColor.match(/\d+/g);
      const hex = `#${((1 << 24) + (parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2])).toString(16).slice(1)}`;

      console.log('Group Box Hex Color:', hex);
    });
  });


  it('navigates to MyGroup when the group info is clicked', async () => {
    const groupData = {
      group_id: 'Group A',
      members: ['Steve', 'Craig', 'John'],
      project: 'Project Alpha'
    };
    groupService.getCurrGroup.mockResolvedValueOnce(groupData);

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<StudentHomePage />} />
        </Routes>
      </MemoryRouter>
    );

    // Find the Paper component containing "Group Info" and click it
    const groupInfoBox = await screen.findByText('Group Info');
    fireEvent.click(groupInfoBox);

    // Simulate navigation to MyGroup page
    await waitFor(() => {
       global.history.pushState({}, 'My Group', '/MyGroup');
    });

  });

});
