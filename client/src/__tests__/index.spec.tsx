import {render, fireEvent, screen} from '@testing-library/react'
import HomePage from '../Containers/HomePage'
import '@testing-library/jest-dom'
import React from 'react';
import { EndGameCard } from 'Containers/HomePage/end_game';

describe("HomePage suits test", () => {
  it("Should find the all texts in the component tree",  () => {
    const {container, getByText} =  render(<HomePage />)

    expect(getByText('Score')).toBeInTheDocument();
    expect(getByText('Gravity')).toBeInTheDocument();
    expect(getByText('Lines')).toBeInTheDocument();
    expect(getByText('Sound')).toBeInTheDocument();
    expect(getByText('Control')).toBeInTheDocument();
    expect(getByText('* PAUSE *')).toBeInTheDocument();
    expect(getByText('Role: you are a')).toBeInTheDocument();
    expect(getByText('Waiting for the game to start ...')).toBeInTheDocument();
    screen.debug();
  });

  it("Should display the end game modal",  () => {
     render(<EndGameCard />)

    expect(screen.getByText("x")).toBeInTheDocument();
  });
})
