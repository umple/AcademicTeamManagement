import os

def get_redirection_url_for_user(user_role: str):
    
    url = "http://localhost:" + os.getenv("REACT")
    if os.getenv("BACKEND_HOST").find("localhost") == -1:
        url = os.getenv("BACKEND_HOST")

    if user_role == "student":
        redirect_url = "%s/StudentHome"%(url)
    elif user_role == "professor":
        redirect_url = "%s/ProfessorHome"%(url)
    else:
        redirect_url = "%s/"%(url) # not implemented yet
    return redirect_url
