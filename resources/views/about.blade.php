@extends('layout.form')
@section('content')
<div class="about-section">
    <h1 style='font-family: "Pixelify Sans", sans-serif;'>Welcome to MyPokePC!</h1>
    <h2><a href = "{{ route('login') }}">Login to get started</a></h2>
    <br/>
    <h2>About us</h2>
    <p style="text-align:justify; margin-left:5%; margin-right:5%">Welcome to MyPokéPC!
        
        MyPokéPC is a free online system meant to both facilitate 
        information distribution of Pokémon, as well as track information 
        of caught Pokémon for avid players and shiny hunters.</p>
</div>
@endsection