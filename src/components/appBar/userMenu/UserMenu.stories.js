import UserName from "./index"

export default {
    component: UserName,
    title: 'Components/UserName',
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { UserName },
    template: '<user-name :email="email" :menu="menu" />',

});

//👇 Each story then reuses that template
export const Primary = Template.bind({});
Primary.args = {
    email: 'user1@mail.co', menu: [
        {
            title: "Profile",
            link: "/users/profile"
        }
    ]
};
