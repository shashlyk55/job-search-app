import { useEffect } from "react";
import { useParams } from "react-router-dom";
import CompanyResponseItem from "../../components/CompanyResponseItem/CompanyResponseItem";
import useResponsesStore from "../../store/useResponsesStore";
import "./CompanyResponsesPage.css";

const CompanyResponsesPage = () => {
    const { id } = useParams();
    const { responses, fetchResponsesForVacancy } = useResponsesStore();

    useEffect(() => {
        fetchResponsesForVacancy(id);
    }, [fetchResponsesForVacancy, id]);

    // const handleApprove = (responseId) => {
    //     approveResponse(responseId);
    // };

    // const handleReject = (responseId) => {
    //     rejectResponse(responseId);
    // };

    return (
        <div className="responses-container">
            <h1>Отклики на вакансию</h1>

            {responses.length === 0 ? (
                <p>Нет откликов на эту вакансию</p>
            ) : (
                <div className="responses-list">
                    {responses.map((response) => (
                        <CompanyResponseItem 
                            key={response._id} 
                            response={response} 
                            // onApprove={handleApprove} 
                            // onReject={handleReject} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompanyResponsesPage;
