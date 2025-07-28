import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

function SearchBar({ placeholder, data }) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const navigate = useNavigate();

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);

    if (data && Array.isArray(data)) {
      const newFilter = data.filter((value) =>
        value.title.toLowerCase().includes(searchWord.toLowerCase())
      );
      setFilteredData(searchWord === "" ? [] : newFilter);
    } else {
      setFilteredData([]);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  const handleSearchSubmission = () => {
    if (wordEntered.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(wordEntered.trim())}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmission();
    }
  };

  const handleSuggestionClick = (value) => {
    clearInput();
    navigate(`/search?q=${encodeURIComponent(value.title)}`);
  };

  return (
    <div className="search relative w-full">
      <div className="searchInputs flex items-center bg-gray-800 rounded-full px-4 py-2 shadow-inner border border-gray-700 focus-within:border-red-500 transition-all duration-300">
        <input
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
          onKeyPress={handleKeyPress}
          className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
        />
        <div
          className="searchIcon ml-2 flex items-center justify-center cursor-pointer"
          onClick={handleSearchSubmission}
        >
          {filteredData.length === 0 ? (
            <Search size={18} className="text-gray-400" />
          ) : (
            <button onClick={clearInput} className="focus:outline-none">
              <X
                size={14}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              />
            </button>
          )}
        </div>
      </div>

      {filteredData.length !== 0 && (
        <div className="dataResult absolute left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10 custom-scrollbar">
          {filteredData.slice(0, 15).map((value, key) => (
            <div
              key={key}
              onClick={() => handleSuggestionClick(value)}
              className="dataItem flex items-center p-3 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
            >
              <p className="text-white text-sm truncate">{value.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
