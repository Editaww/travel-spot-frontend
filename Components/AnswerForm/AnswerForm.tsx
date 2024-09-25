import React, { useState } from "react";
import styles from "./styles.module.css";
import Button from "../Button/Button";
import cookie from "js-cookie";
import axios from "axios";

type AnswerFormProps = {
  userName: string;
  questionId: string;
  onAnswerAdded: () => void;
};

const AnswerForm = ({ questionId, onAnswerAdded }: AnswerFormProps) => {
  const [userName, setUserName] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [isShowError, setShowError] = useState(false);
  const [isAddAnswer, setAddAnswer] = useState(false);

  const addAnswer = async () => {
    if (!answerText) {
      setShowError(true);
      return;
    }

    try {
      setAddAnswer(true);
      const jwt = cookie.get(process.env.JWT_KEY as string);
      const body = {
        userName,
        answerText,
      };

      const headers = {
        authorization: jwt,
      };

      const response = await axios.post(
        `${process.env.SERVER_URL}/questions/${questionId}/answers`,
        body,
        { headers }
      );

      if (response.status === 201) {
        setUserName("");
        setAnswerText("");
        onAnswerAdded();
        setShowError(false);
      }
    } catch (err) {
      console.log(err);
      setShowError(true);
    } finally {
      setAddAnswer(false);
    }
  };

  return (
    <div className={styles.main}>
      <input
        value={userName}
        placeholder="Name"
        type="text"
        onChange={(e) => {
          setUserName(e.target.value);
        }}
      />
      <textarea
        value={answerText}
        placeholder="Enter your answer"
        className={styles.textarea}
        onChange={(e) => {
          setAnswerText(e.target.value);
          if (e.target.value) {
            setShowError(false);
          }
        }}
      />
      {isShowError && (
        <h5 className={styles.error}>Answer field must be filled</h5>
      )}
      <Button
        isLoading={isAddAnswer}
        title="Add Answer"
        onClick={() => {
          addAnswer();
        }}
      />
    </div>
  );
};

export default AnswerForm;
