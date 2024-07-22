import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import FilterInterns from "./FilterInterns";
import Pagination from "./Pagination"; // Import Pagination component
// import { XMarkIcon } from "@heroicons/react/24/outline"; // Import Heroicons XMarkIcon for clear button

const AllInternships = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Fetch internships from the backend
    const fetchInternships = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/student/internships"
        );
        setInternships(response.data);
        console.log(response.data);
        setFilteredInternships(response.data);
      } catch (error) {
        console.error("Error fetching internships:", error);
      }
    };
    fetchInternships();
  }, []);

  const handleFilter = (filters) => {
    // Filter logic here based on filters
    let filteredInternships = internships;

    if (filters.location) {
      filteredInternships = filteredInternships.filter(
        (internship) => internship.location === filters.location
      );
    }

    if (filters.company) {
      filteredInternships = filteredInternships.filter(
        (internship) => internship.company === filters.company
      );
    }

    if (filters.industry) {
      filteredInternships = filteredInternships.filter((internship) =>
        internship.role.toLowerCase().includes(filters.industry.toLowerCase())
      );
    }

    if (filters.type.fullTime) {
      filteredInternships = filteredInternships.filter(
        (internship) => internship.type === "Full time"
      );
    }

    if (filters.type.partTime) {
      filteredInternships = filteredInternships.filter(
        (internship) => internship.type === "Part time"
      );
    }

    if (filters.type.remote) {
      filteredInternships = filteredInternships.filter(
        (internship) => internship.type === "Remote"
      );
    }

    if (filters.payment.free) {
      filteredInternships = filteredInternships.filter(
        (internship) => internship.payment === "free"
      );
    }

    if (filters.payment.paid) {
      filteredInternships = filteredInternships.filter(
        (internship) => internship.payment === "paid"
      );
    }

    setFilteredInternships(filteredInternships);
  };

  const handleClearFilter = () => {
    setFilteredInternships(internships);
  };

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentInternships = filteredInternships.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value !== "") {
      const filteredSuggestions = internships.filter((internship) =>
        internship.title.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setFilteredInternships(internships);
  };

  const handleSuggestionClick = (title) => {
    setSearchTerm(title);
    setSuggestions([]);
    const filteredResults = internships.filter((internship) =>
      internship.title.toLowerCase().includes(title.toLowerCase())
    );
    setFilteredInternships(filteredResults);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-600">
          All Available Internships
        </h2>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by title..."
            className="border rounded-lg p-2 pr-10"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
          {suggestions.length > 0 && (
            <div className="absolute bg-white border rounded-lg shadow-lg mt-2 w-full z-10">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSuggestionClick(suggestion.title)}
                >
                  {suggestion.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/3 p-4">
          <FilterInterns onFilter={handleFilter} onClear={handleClearFilter} />
        </div>
        <div className="w-full lg:w-2/3 p-4">
          {currentInternships.map((internship, index) => (
            <div
              key={index}
              className="relative border rounded-lg p-6 mb-6 bg-white shadow-lg"
            >
              <div className="flex items-center mb-4">
                <img
                  src={internship.logo}
                  className="w-12 h-12 mr-4 rounded-full"
                  alt="logo"
                />
                <div>
                  <h3 className="font-bold text-xl text-gray-800">
                    {internship.title}
                  </h3>
                  <p className="text-gray-600">
                    {internship.company?.companyDetails?.name || "N/A"}
                  </p>
                </div>
              </div>
              <p className="text-blue-600 mb-2">{internship.role}</p>
              <p className="text-gray-700 mb-2 font-medium">
                Duration: {internship.duration}
              </p>
              <p className="text-gray-600 mb-2">
                Location: {internship.location}
              </p>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {internship.description}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-blue-800 font-semibold">
                  {internship.payment}
                </p>
                <p className="text-gray-800 capitalize">{internship.type}</p>
                <div className="text-yellow-500 text-xl">
                  {"★".repeat(internship.rating) +
                    "☆".repeat(5 - internship.rating)}
                </div>
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                  onClick={() => navigate(`/internship/${internship._id}`)}
                >
                  View
                </button>
              </div>
            </div>
          ))}
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={filteredInternships.length}
            paginate={paginate}
            currentPage={currentPage} // Pass the currentPage as a prop
          />
        </div>
      </div>
    </div>
  );
};

export default AllInternships;
