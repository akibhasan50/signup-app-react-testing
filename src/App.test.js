import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import isTaxID from "validator/lib/istaxid";
import App from "./App";

beforeEach(() => {
  render(<App></App>);
});

const typeIntoForm = ({ email, password, confirmPassword }) => {
  const emailElement = screen.getByRole("textbox", {
    name: /email/i,
  });
  const passElement = screen.getByLabelText("Password");
  const confpassElement = screen.getByLabelText(/confirm Password/i);
  if (email) {
    userEvent.type(emailElement, email);
  }
  if (password) {
    userEvent.type(passElement, password);
  }
  if (confirmPassword) {
    userEvent.type(confpassElement, confirmPassword);
  }

  return {
    emailElement,
    passElement,
    confpassElement,
  };
};
it("inputs should be initially empty", () => {
  const emailInputElement = screen.getByRole("textbox");
  const passwordInputElement = screen.getByLabelText("Password");
  const confirmpasswordInputElement =
    screen.getByLabelText(/confirm Password/i);

  expect(emailInputElement.value).toBe("");
  expect(passwordInputElement.value).toBe("");
  expect(confirmpasswordInputElement.value).toBe("");
});

it("should be able to type email", () => {
  const { emailElement } = typeIntoForm({ email: "akib@gmail.com" });

  expect(emailElement.value).toBe("akib@gmail.com");
});
it("should be able to type password", () => {
  const { passElement } = typeIntoForm({ password: "123456" });

  expect(passElement.value).toBe("123456");
});
it("should be able to type confirm password", () => {
  const { confpassElement } = typeIntoForm({ confirmPassword: "123456" });

  expect(confpassElement.value).toBe("123456");
});

it("should show email error message on invalid email", () => {
  const emailErrorMsg = screen.queryByText(/The email you input is invalid./i);
  const emailElement = screen.getByRole("textbox", {
    name: /email/i,
  });
  const submitBtnElement = screen.getByRole("button", {
    name: /submit/i,
  });

  expect(emailErrorMsg).not.toBeInTheDocument();
  userEvent.type(emailElement, "akibgmail.com");
  userEvent.click(submitBtnElement);
  const emailErrorMsgAgain = screen.queryByText(
    /The email you input is invalid./i
  );
  expect(emailErrorMsgAgain).toBeInTheDocument();
});

it("should show password error message on less than 5 characters", () => {
  const emailErrorMsg = screen.queryByText(/The email you input is invalid./i);
  const passErrorMsg = screen.queryByText(
    /The password you entered should contain 5 or more characters./i
  );

  const submitBtnElement = screen.getByRole("button", {
    name: /submit/i,
  });

  expect(emailErrorMsg).not.toBeInTheDocument();
  expect(passErrorMsg).not.toBeInTheDocument();
  typeIntoForm({ email: "akib@gmail.com" });
  typeIntoForm({ password: "123" });

  userEvent.click(submitBtnElement);
  const passErrorMsgAgain = screen.queryByText(
    /The password you entered should contain 5 or more characters./i
  );
  expect(passErrorMsgAgain).toBeInTheDocument();
});
it("should show password error message on password  not matching", () => {
  const emailErrorMsg = screen.queryByText(/The email you input is invalid./i);
  const confpassErrorMsg = screen.queryByText(
    /The passwords don't match. Try again./i
  );

  const submitBtnElement = screen.getByRole("button", {
    name: /submit/i,
  });

  expect(emailErrorMsg).not.toBeInTheDocument();
  expect(confpassErrorMsg).not.toBeInTheDocument();

  typeIntoForm({ email: "akib@gmail.com" });
  typeIntoForm({ password: "123234" });

  userEvent.click(submitBtnElement);
  const confpassErrorMsgAgain = screen.queryByText(
    /The passwords don't match. Try again./i
  );
  expect(confpassErrorMsgAgain).toBeInTheDocument();
});
